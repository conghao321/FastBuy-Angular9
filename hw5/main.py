from flask import Flask,send_file
from flask import request,jsonify
from flask import make_response
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
    #we only accept GET method
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
        sortBy=data.get("sortBy")
        
        ###required params
        params_dict={'OPERATION-NAME':'findItemsAdvanced','SERVICE-VERSION':'1.0.0',
        'SECURITY-APPNAME':'haocong-laodashi-PRD-32eb6beb6-89281c37','RESPONSE-DATA-FORMAT':'JSON','REST-PAYLOAD':'',
        'keywords':keyWords,'paginationInput.entriesPerPage':10}

        ###get the filters url:
        filters_url=get_filter_url(priceMin,priceMax,newItem,usedItem,veryGoodItem,goodItem,acceptableItem,returnAccepted,freeShipping,expShipping,sortBy)
        
        ###get the return data from eBay
        item_dict=eBayCall(params_dict,filters_url)

        ###The retrieved data should be dealt in python server-side
        result=get_result(item_dict)
        res=json.dumps(result)

    return res


#This function is used to merge the urls and call the eBay API to retrieve data
#it will return a a data from eBay
def eBayCall(params_dict,filters_url):
    prev_url='https://svcs.ebay.com/services/search/FindingService/v1'
    r=requests.get(prev_url,params_dict)
    url=r.url+filters_url
    r=requests.get(url)
    r.headers.update({'Cache-Control':'no-store','Pragma':'no-cache'})
    print(r.url)
    item_json=r.json()
    #print(item_json)
    return item_json


#Tis function is used to get the filters
def get_filter_url(priceMin,priceMax,newItem,usedItem,veryGoodItem,goodItem,acceptableItem,returnAccepted,freeShipping,expShipping,sortBy):
    filter_url='&sortOrder='+sortBy
    filter_counter=0
    
    if(priceMax!=''):
        filter_url+='&itemFilter('+str(filter_counter)+').name=MaxPrice&itemFilter('+str(filter_counter)+').value='+priceMax+'&itemFilter('+str(filter_counter)+').paramName=Currency&itemFilter('+str(filter_counter)+').paramValue=USD'
        filter_counter+=1
    if(priceMin!=''):
        filter_url+='&itemFilter('+str(filter_counter)+').name=MinPrice&itemFilter('+str(filter_counter)+').value='+priceMin+'&itemFilter('+str(filter_counter)+').paramName=Currency&itemFilter('+str(filter_counter)+').paramValue=USD'
        filter_counter+=1
    if(returnAccepted=='true'):
        filter_url+='&itemFilter('+str(filter_counter)+').name=ReturnsAcceptedOnly&itemFilter('+str(filter_counter)+').value='+returnAccepted
        filter_counter+=1
    if(freeShipping=='true'):
        filter_url+='&itemFilter('+str(filter_counter)+').name=FreeShippingOnly&itemFilter('+str(filter_counter)+').value='+freeShipping
        filter_counter+=1
    if(expShipping=='true'):
        filter_url+='&itemFilter('+str(filter_counter)+').name=ExpeditedShippingType&itemFilter('+str(filter_counter)+').value=Expedited'
        filter_counter+=1
    if(newItem=='true' or usedItem=='true' or veryGoodItem=='true' or goodItem=='true' or acceptableItem=='true'):
        filter_url+='&itemFilter('+str(filter_counter)+').name=Condition'
        condition_counter=0;
        if(newItem=='true'):
            filter_url+='&itemFilter('+str(filter_counter)+').value('+str(condition_counter)+')=1000'
            condition_counter+=1
        if(usedItem=='true'):
            filter_url+='&itemFilter('+str(filter_counter)+').value('+str(condition_counter)+')=3000'
            condition_counter+=1
        if(veryGoodItem=='true'):
            filter_url+='&itemFilter('+str(filter_counter)+').value('+str(condition_counter)+')=4000'
            condition_counter+=1
        if(goodItem=='true'):
            filter_url+='&itemFilter('+str(filter_counter)+').value('+str(condition_counter)+')=5000'
            condition_counter+=1
        if(acceptableItem=='true'):
            filter_url+='&itemFilter('+str(filter_counter)+').value('+str(condition_counter)+')=6000'
            condition_counter+=1                       
    return filter_url



def get_result(res_dict):
    total_count=res_dict['findItemsAdvancedResponse'][0]['paginationOutput'][0]['totalEntries'][0] 
    obj_list=[] 
    if(total_count=='0'):
        obj_list.append(0)
        return obj_list

    search_result=res_dict['findItemsAdvancedResponse'][0]['searchResult'][0]
    item_count=int(search_result['@count'])
    items_list=search_result['item']

    obj_list.append(total_count)
    for i in range(item_count):
        item=dict()
        item['title']=items_list[i]['title'][0]
        #price
        item['price']=items_list[i]['sellingStatus'][0]['convertedCurrentPrice'][0]['__value__']
        item['currency']=items_list[i]['sellingStatus'][0]['convertedCurrentPrice'][0]['@currencyId']
        
        #item info
        try:
            item['imageURL']=items_list[i]['galleryURL'][0]
        except KeyError:
            item['imageURL']='https://thumbs1.ebaystatic.com/pict/04040_0.jpg'

        try:
            item['category']=items_list[i]['primaryCategory'][0]['categoryName'][0]
        except KeyError:
            pass

        try:
            item['productLink']=items_list[i]['viewItemURL'][0]
        except KeyError:
            pass
        try:
            item['condition']=items_list[i]['condition'][0]['conditionDisplayName'][0]
        except KeyError:
            pass            
        try:
            item['topRated']=items_list[i]['topRatedListing'][0]
        except KeyError:
            pass
        #shipping
        try:
            item['shippingCost']=items_list[i]['shippingInfo'][0]['shippingServiceCost'][0]['__value__']
        except KeyError:
            pass

        try:
            item['acceptReturn']=items_list[i]['returnsAccepted'][0]
        except KeyError:
            pass
        try:
            item['expedited']=items_list[i]['shippingInfo'][0]['expeditedShipping'][0]
        except KeyError:
            pass
        try:
            item['location']=items_list[i]['location'][0]
        except KeyError:
            pass       
        #add it into the dict
        obj_list.append(item)

    #return the complete dict result
    return obj_list


if __name__ == '__main__':
    # This is used when running locally only. When deploying to Google App
    # Engine, a webserver process such as Gunicorn will serve the app. This
    # can be configured by adding an `entry point` to app.yaml.
    app.run(host='127.0.0.1', port=8080, debug=True)
# [END gae_python37_app]