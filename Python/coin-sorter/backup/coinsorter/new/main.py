#!/usr/bin/python3
import json
import cgi, cgitb
import cv2
import numpy as np
import pandas as pd
import time, sys ,os ,glob

print("Content-type: application/json")
print()

form = cgi.FieldStorage()
urlq = form.getvalue('url')

#Image resizing
orginal_width,orginal_height  = 600 ,350 
image_width,image_height      = 960 ,540

#Finding the ratio
ratio_x,ratio_y = orginal_width/image_width , orginal_height/image_height 
arm_speed = 30   # max 99



## Strightend the image using four points
def order_points(pts):
   rect = np.zeros((4, 2), dtype = "float32")
   s = pts.sum(axis = 1)
   rect[0] = pts[np.argmin(s)]
   rect[2] = pts[np.argmax(s)]
   diff = np.diff(pts, axis = 1)
   rect[1] = pts[np.argmin(diff)]
   rect[3] = pts[np.argmax(diff)]
   return rect


# Strightend the image using four points
def four_point_transform(image, pts):
   ## print"using edge points Strightend the image")
   rect = order_points(pts)
   (tl, tr, br, bl) = rect
   widthA = np.sqrt(((br[0] - bl[0]) ** 2) + ((br[1] - bl[1]) ** 2))
   widthB = np.sqrt(((tr[0] - tl[0]) ** 2) + ((tr[1] - tl[1]) ** 2))
   maxWidth = max(int(widthA), int(widthB))
   maxWidth = image_width
   heightA = np.sqrt(((tr[0] - br[0]) ** 2) + ((tr[1] - br[1]) ** 2))
   heightB = np.sqrt(((tl[0] - bl[0]) ** 2) + ((tl[1] - bl[1]) ** 2))
   maxHeight = max(int(heightA), int(heightB))
   maxHeight = image_height
   dst = np.array([
      [0, 0],
      [maxWidth - 1, 0],
      [maxWidth - 1, maxHeight - 1],
      [0, maxHeight - 1]], dtype = "float32")

   M = cv2.getPerspectiveTransform(rect, dst)
   warped = cv2.warpPerspective(image, M, (maxWidth, maxHeight))
   warped = cv2.flip( warped, 0 )

   return warped

def coin_by_size(keyPoint,test_frame):
   global ratio_y
   coin = 0


   x, y ,s = keyPoint.pt[0] , keyPoint.pt[1], keyPoint.size
   
   if int(s*ratio_y)>16 and int(s*ratio_y)<19:

      pixel= test_frame[int(y), int(x)]
      # normal_List = np.array(pixel).tolist()
      r_code = pixel[2]
      g_code = pixel[1]
      b_code = pixel[0]

      r_Max =  color_code_df['R'].max()+20
      r_Min =  color_code_df['R'].min()-20
      g_Max =  color_code_df['G'].max()+20
      g_Min =  color_code_df['G'].min()-20
      b_Max =  color_code_df['B'].max()+30
      b_Min =  color_code_df['B'].min()-10

      
      if (r_Min <= r_code <= r_Max) and (g_Min <= g_code <= g_Max) and (b_Min <=  b_code <= b_Max) :                
         coin = 10
      else:
         coin = 1

   elif int(s*ratio_y)>=20 and int(s*ratio_y)<=22:
      coin = 5
      
   elif int(s*ratio_y)>=23 and int(s*ratio_y)<=26:
      coin = 25

   return coin 



def error_correction(X,Y):
   if(Y > 30):
      Y +=  3
   if(Y > 140):
      Y +=  3
   if(Y > 190):
      Y +=  3
   if(Y > 240):
      Y +=  2
   if(Y > 290):
      Y +=  3
  
   if(X > 150):
      X -= 2
   if(X > 200):
      X -= 1
   if(X > 250):
      X -= 3
   if(X < 0):
      X += 2 
   if(X < -100):
      X += 1
   if(X < -150):
      X += 2
   if(X < -200):
      X += 1
   if(X < -250):
      X += 3

   return X, Y



def Coinfinder(img):
   coin  = 0

   global ratio_x, ratio_y ,Arm_Flag , edge_Points_df ,color_code_df,armOn
   test_frame = img.copy()
   
   color_code_df = pd.read_csv("color_code_df.csv")
   keypoints = blob_function(img)
   f= open("cord.txt","w+")
   for keyPoint in keypoints:

      x, y ,s = keyPoint.pt[0] , keyPoint.pt[1], keyPoint.size
      X, Y  = 310-(x*ratio_y) ,(y*ratio_x) 
      X, Y  = error_correction(X,Y)
      coin = coin_by_size(keyPoint ,test_frame)
  
      # print(X,Y,coin)
      co_coin = str(X)+","+str(Y)+","+str(coin)
      # print(co_coin)
      f.write(co_coin)
      f.write('\n')

      ## Final Image display 
      cord_text = str(int(Y))+","+str(int(X))+"->"+str(coin)
      center = (int(x), int(y))
    
      line_1x  ,line_1y, line_1x1 ,line_1y1  = x+(s/2) , y ,x-(s/2) , y 
      line_2x  ,line_2y, line_2x1 ,line_2y1  = x , y +(s/2) ,x , y -(s/2)

      cv2.putText(img, cord_text, center, cv2.FONT_HERSHEY_SIMPLEX,.4, (255, 255, 1), 1)
      cv2.line(img, (int(line_1x1) ,int(line_1y1)), (int(line_1x), int(line_1y)),(255, 0, 255), 1)
      cv2.line(img, (int(line_2x1) ,int(line_2y1)), (int(line_2x), int(line_2y)),(255, 0, 255), 1)
      cv2.circle(img, center, 1, (0, 100, 100), 1)
      data = cv2.drawKeypoints(img, keypoints, np.array([]), (0,0,255), cv2.DRAW_MATCHES_FLAGS_DRAW_RICH_KEYPOINTS)
   f.close() 
   return data



def blob_function(img):
   params = cv2.SimpleBlobDetector_Params()

   params.minThreshold = 10
   params.maxThreshold = 256

   # Filter by Circularity
   params.filterByCircularity = True
   params.minCircularity = 0.8

   # Filter by Area.
   params.filterByArea = True
   params.filterByArea = True
   params.minArea = 30


   # Filter by Convexity
   params.filterByConvexity = True
   params.minConvexity = 0.87
      
   # Filter by Inertia
   params.filterByInertia = True
   params.minInertiaRatio = 0.1

   params.filterByColor=True
   params.blobColor=255

   # Create a detector with the parameters
   ver = (cv2.__version__).split('.')
   if int(ver[0]) < 3 :
      detector = cv2.SimpleBlobDetector(params)
   else : 
      detector = cv2.SimpleBlobDetector_create(params)

   # Detect blobs.
   keypoints = detector.detect(img)
   return keypoints



def main(url):
   #Video Capture
   camera = cv2.VideoCapture(url)
   _, orginial_img = camera.read()

   #getting the RGB values from CSV file
   color_code_df = pd.read_csv("color_code_df.csv")
   #getting the edges values
   edge_Points_df =pd.read_csv("edge_Points_df.csv")
   edge_Points_df['X'] = edge_Points_df['X'].astype(int)
   edge_Points_df['Y'] = edge_Points_df['Y'].astype(int)

   # getting four edge points from csv 
   coords = "[({}, {}), ({}, {}),({}, {}), ({}, {}) ]".format(edge_Points_df['X'][0],edge_Points_df['Y'][0],edge_Points_df['X'][1],edge_Points_df['Y'][1],edge_Points_df['X'][2],edge_Points_df['Y'][2],edge_Points_df['X'][3],edge_Points_df['Y'][3]) 
   pts = np.array(eval(coords), dtype = "float32")

   # resizing the frame 
   img_width,img_height = int(orginial_img.shape[1]/2) , int(orginial_img.shape[0]/2)
   # img_width,img_height = int(original_img.shape[1]/1.33333333) , int(original_img.shape[0]/1.33333333)
   frame = cv2.resize( orginial_img,(img_width,img_height))

   # cut the image using four points 
   resizedimage =  four_point_transform(frame,pts)
   # cv2.imwrite("resizedimage.png" , resizedimage)
   
   ## send the frame to find the co-ordinates and coin
   data =  Coinfinder(resizedimage)
   # cv2.imwrite("coin.png" , data)
   camera.release()
   cv2.destroyAllWindows()


   response={}
   response["status"] = 200
   response["msg"] = "coins detecde"
   print(json.dumps(response))
# main()

main(urlq)
# main("http://192.168.1.100:8080")
