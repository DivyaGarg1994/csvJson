console.log("hello");
var fs = require("fs");
var readline = require("readline");

const r1 = readline.createInterface({
  input : fs.createReadStream("FoodFacts.csv")
});

var lines =[];
var header = 0, headContent;

var countryObj = {
  "North Europe":{},
  "Central Europe":{},
  "South Europe":{}
};

var fat, protein, carbo;

var countries1 = ["United Kingdom","Denmark","Sweden","Norway"];
var countries2 = ["France","Belgium","Germany","Switzerland","Netherlands"];
var countries3 = ["Portugal","Greece","Italy","Spain","Croatia","Albania"];

var carboCounter = [];
var proteinCounter = [];
var fatCounter = [];

var keys;

r1.on('line' , (line) =>{

  if(header==0)
  {
    headContent = line.split(",");
    country = headContent.indexOf("countries_en");
    carbo = headContent.indexOf("carbohydrates_100g");
    protein = headContent.indexOf("proteins_100g");
    fat = headContent.indexOf("fat_100g");

    keys = Object.keys(countryObj);
    keys.forEach(function(key){
      carboCounter.push(0);
      proteinCounter.push(0);
      fatCounter.push(0);
      countryObj[key][headContent[fat]] = 0;
      countryObj[key][headContent[carbo]] = 0;
      countryObj[key][headContent[protein]] = 0;
    });
  }

  else{
    var regex = /".*?"/g;
    var arr,temp;
    var lineTemp = line;
    while((arr = regex.exec(line))){
      temp = arr[0].replace(/,/g,"@@@");
      lineTemp = lineTemp.replace(arr[0] , temp);

    }
    var lineArr = lineTemp.split(",");
    var conArr = lineArr[country].split("@@@");

    conArr.forEach(function(el){

      var area = -1;
      el = el.replace("\"","");
      if(countries1.indexOf(el)!=-1)
      {
        if(checkNaN(lineArr[fat]))
        countryObj["North Europe"][headContent[fat]] += parseFloat(lineArr[fat]);

        if(checkNaN(lineArr[carbo]))
        countryObj["North Europe"][headContent[carbo]] += parseFloat(lineArr[carbo]);

        if(checkNaN(lineArr[protein]))
        countryObj["North Europe"][headContent[protein]] += parseFloat(lineArr[protein]);
        area=0;

      }

      if(countries2.indexOf(el)!=-1)
      {
        if(checkNaN(lineArr[fat]))
        countryObj["Central Europe"][headContent[fat]] += parseFloat(lineArr[fat]);

        if(checkNaN(lineArr[carbo]))
        countryObj["Central Europe"][headContent[carbo]] += parseFloat(lineArr[carbo]);

        if(checkNaN(lineArr[protein]))
        countryObj["Central Europe"][headContent[protein]] += parseFloat(lineArr[protein]);
        area =1;
      }

      if(countries3.indexOf(el)!=-1)
      {
        if(checkNaN(lineArr[fat]))
        countryObj["South Europe"][headContent[fat]] += parseFloat(lineArr[fat]);

        if(checkNaN(lineArr[carbo]))
        countryObj["South Europe"][headContent[carbo]] += parseFloat(lineArr[carbo]);

        if(checkNaN(lineArr[protein]))
        countryObj["South Europe"][headContent[protein]] += parseFloat(lineArr[protein]);
        area = 2;
      }

      // console.log(area);
      if(area!=-1){
        if(checkNaN(lineArr[protein])){
          proteinCounter[area]++;
        }

        if(checkNaN(lineArr[fat])){
          fatCounter[area]++;
        }

        if(checkNaN(lineArr[carbo])){
          carboCounter[area]++;
        }
      }

    });
  }


  header++;

});

function checkNaN(value){

  if(value.trim()=="")
  return false;
  else
  return true;
}// checkNaN


function  avg(carboCounter , fatCounter , proteinCounter , countryObj){

  var keys = Object.keys(countryObj);

  for(var el in countryObj){

    var index = keys.indexOf(el);
    countryObj[el]["proteins_100g"] /= proteinCounter[index];
    countryObj[el]["carbohydrates_100g"] /= carboCounter[index];
    countryObj[el]["fat_100g"] /= fatCounter[index];
  };

  return countryObj;
} //avg



r1.on('close',function(){

  var newCountryObj = avg(carboCounter , fatCounter , proteinCounter , countryObj);
  fs.writeFileSync('result2.json',JSON.stringify(newCountryObj),'utf-8');
});
