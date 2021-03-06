#!/usr/bin/python3
from time import sleep
import datetime,os
from uf.wrapper.swift_api import SwiftAPI 
from uf.utils.log import *
import json
import cgi , cgitb

#Granting permission to /dev for connecting to UARM
os.system("sudo chmod -R 777 /dev &")

print("Content-type: application/json")
print()
form = cgi.FieldStorage()

#Connecting to the Uarm
swift = SwiftAPI()
sleep(2)
swift.set_buzzer()

#Removing the previous file if it already exists
try:
  os.remove("Armstatus.txt")
except OSError:
  pass

#Reseting the file value as True
file =open('Armstatus.txt','w')
file.write('True')
file.close()

## Arm move controller
def armmove(x, y,toX ,toY):
   

   #setting global arm_speed
   global arm_speed
   arm_speed = 75
   
   swift.set_position(x, y, 100, arm_speed, relative=False, wait=True)
   sleep(1) 

   swift.set_position(x, y, 40, 5, relative=False, wait=True)
   sleep(1)

   swift.set_pump(True)
   sleep(1)

   swift.set_position(x, y, 100, arm_speed, relative=False, wait=True)
   sleep(1)

   swift.set_position(toX, toY, 100, arm_speed, relative=False, wait=True)
   sleep(1)

   swift.set_pump(False)
   sleep(1)
      

def main():
   #Opening the Coordinates file
   with open('cord.txt','r') as fobj:
      lines = fobj.read().splitlines()
      for line in lines:
          #Reading the arm current status from file      
          with open('Armstatus.txt','r') as status_obj:
              status = status_obj.read().strip()              
              if (status == 'True'):                 
                position = line.split(",")               

                if(position[2] == "25"):
                  ## print("taking 25 cent")
                  armmove(position[1], position[0], -20, 250)      

                elif(position[2] == "5"):
                  ## print("taking 5 cent")
                  armmove(position[1], position[0], -20, 200)     

                elif(position[2] == "10"):
                  ## print("taking 10 cent")
                  armmove(position[1], position[0], -20, 150)      

                elif(position[2] == "1"):
                  ## print("taking 1 cent")
                  armmove(position[1], position[0], -20, 100)
              
              else:
                    break              
      
           
   #Json response      
   response={}
   response["status"] = 200
   # response["count"] = count
   print(json.dumps(response))

   
#Main function call
main()
