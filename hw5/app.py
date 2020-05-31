from flask import Flask,send_file
from flask import request,jsonify
import json
import requests

app = Flask(__name__)

#This is the index rout
@app.route('/',methods=['GET','POST'])
def index():
    return send_file('index.html')


#This function is the main method and it is to distribute parameters\
#to next their stations
@app.route('/input',methods=['GET','POST'])
def input():
    url=""
    if(request.method=='GET'):
        data=request.args    
        keyWords=data.get("key-words")
        priceMin=data.get("price1")
        priceMax=data.get("price2")
        newItem=data.get("newItem")
        usedItem=data.get("usedItem")
        veryGoodItem=data.get("veryGoodItem")
        goodItem=data.get("goodItem")
        acceptableItem=data.get("acceptableItem")
        returnAccepted=data.get("returnAccepted")
        freeShipping=data.get("freeShipping")
        expShipping=data.get("expShipping")
        sortBy=data.get("veryGoodItem")

        ###required params
        params_dict={'OPERATION-NAME':'findItemsAdvanced','SERVICE-VERSION':'1.0.0',
        'SECURITY-APPNAME':'haocong-laodashi-PRD-32eb6beb6-89281c37','RESPONSE-DATA-FORMAT':'JSON','REST-PAYLOAD':'',
        'keywords':'iphone'}

        ###filters url:
        filters_url=get_filter_url(priceMin,priceMax,newItem,usedItem,veryGoodItem,goodItem,acceptableItem,returnAccepted,freeShipping,expShipping,sortBy)
        ###return data
        item_dict=eBayCall(params_dict,filters_url)
        print(item_dict)

    return json.dumps(item_dict)


#This function is used to call the eBay API and retrieve data
def eBayCall(params_dict,filters_url):
    prev_url='https://svcs.ebay.com/services/search/FindingService/v1'
    r=requests.get(prev_url,params_dict)
    url=r.url+filters_url
    r=requests.get(url)
    print(r.url)

    item_json=r.json()
    #print(item_json)
    return item_json


#Tis function is used to get the filters
def get_filter_url(priceMin,priceMax,newItem,usedItem,veryGoodItem,goodItem,acceptableItem,returnAccepted,freeShipping,expShipping,sortBy):
    filter_url='&sortOrder=BestMatch'
    filter_url+='&itemFilter(0).name=MaxPrice&itemFilter(0).value='+priceMax+'&itemFilter(0).paramName=Currency&itemFilter(0).paramValue=USD'
    filter_url+='&itemFilter(1).name=MinPrice&itemFilter(1).value='+priceMin+'&itemFilter(1).paramName=Currency&itemFilter(1).paramValue=USD'
    filter_url+='&itemFilter(2).name=ReturnsAcceptedOnly&itemFilter(2).value='+returnAccepted
    filter_url+='&itemFilter(3).name=FreeShippingOnly&itemFilter(3).value='+freeShipping
    #filter_url+='&itemFilter(4).name=ExpeditedShippingType&itemFilter(4).value='+expShipping
    filter_url+='&itemFilter(5).name=Condition&itemFilter(5).value(0)=2000&itemFilter(5).value(1)=3000'
    return filter_url



