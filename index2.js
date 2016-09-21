console.log("hello");
var fs = require("fs");
var readline = require("readline");

const r1 = readline.createInterface({
  input : fs.createReadStream("FoodFacts.csv")
});

var lines =[];
var header = 0,headContent;

var countryObj = {"North Europe":{},"Central Europe":{},"South Europe":{}};
var fat , protein , carbo;

var countries1 = ["United Kingdom","Denmark","Sweden","Norway"];
var countries2 = ["France","Belgium","Germany","Switzerland","Netherlands"];
var countries3 = ["Portugal","Greece","Italy","Spain","Croatia","Albania"];

var carboCounter = [0,0,0];
var proteinCounter = [0,0,0];
var fatCounter = [0,0,0];




r1.on('line' , (line) =>{

  if(header==0)
  {
    headContent = line.split(",");

  country = headContent.indexOf("countries_en");
  carbo = headContent.indexOf("carbohydrates_100g");
  protein = headContent.indexOf("proteins_100g");
  fat = headContent.indexOf("fat_100g")

    for(var key in countryObj){
        if(countryObj.hasOwnProperty(key)){
          countryObj[key][headContent[fat]] = 0;
          countryObj[key][headContent[carbo]] = 0;
          countryObj[key][headContent[protein]] = 0;

        //  console.log(countryObj);
        }
      }
  }

  else{

    var regex = /".*?"/g;
    var arr,temp;
    var lineTemp = line;



//console.log("Before "+line.split(",").length);
    while((arr = regex.exec(line))){
    //  console.log(arr[0]);
          temp = arr[0].replace(/,/g,"@@@");
          lineTemp = lineTemp.replace(arr[0] , temp);

      }


      var lineArr = lineTemp.split(",");
      var conArr = lineArr[country].split("@@@");

    if(lineArr[fat].trim() == "")
      lineArr[fat] = 0;

      if(lineArr[protein].trim() == "")
        lineArr[protein] = 0;

      if(lineArr[carbo].trim() == "")
        lineArr[carbo] = 0;

  conArr.forEach(function(el){

    var area = -1;

            if(countries1.indexOf(el)!=-1)
            {

                  countryObj["North Europe"][headContent[fat]] += parseFloat(lineArr[fat]);
                  countryObj["North Europe"][headContent[carbo]] += parseFloat(lineArr[carbo]);
                  countryObj["North Europe"][headContent[protein]] += parseFloat(lineArr[protein]);
                  area=0;
                    //console.log(countryObj);
            }

            if(countries2.indexOf(el)!=-1)
            {

              countryObj["Central Europe"][headContent[fat]] += parseFloat(lineArr[fat]);
              countryObj["Central Europe"][headContent[carbo]] += parseFloat(lineArr[carbo]);
              countryObj["Central Europe"][headContent[protein]] += parseFloat(lineArr[protein]);
              area =1;
            }

            if(countries3.indexOf(el)!=-1)
            {

              countryObj["South Europe"][headContent[fat]] += parseFloat(lineArr[fat]);
              countryObj["South Europe"][headContent[carbo]] += parseFloat(lineArr[carbo]);
              countryObj["South Europe"][headContent[protein]] += parseFloat(lineArr[protein]);
              area = 2;
            }

            // console.log(area);
            if(area!=-1){
              if(lineArr[protein]!=0){
                proteinCounter[area]++;
              }

              if(lineArr[fat]!=0){
                fatCounter[area]++;
              }

              if(lineArr[carbo]!=0){
                carboCounter[area]++;
              }
          }

        });
  }


  header++;

});


function  avg(carboCounter , fatCounter , proteinCounter , countryObj){

  var keys = Object.keys(countryObj);

  for(var el in countryObj){

      var index = keys.indexOf(el);
      countryObj[el]["proteins_100g"] /= proteinCounter[index];
      countryObj[el]["carbohydrates_100g"] /= carboCounter[index];
        countryObj[el]["fat_100g"] /= fatCounter[index];
  };

  return countryObj;
  console.log(countryObj)
} //avg



r1.on('close',function(){

  var newCountryObj = avg(carboCounter , fatCounter , proteinCounter , countryObj);
	fs.writeFileSync('result2.json',JSON.stringify(newCountryObj),'utf-8');
});
