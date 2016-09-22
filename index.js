console.log("hello");
var fs = require("fs");
var readline = require("readline");

const r1 = readline.createInterface({
  input : fs.createReadStream("FoodFacts.csv")
});

var lines =[];
var header = 0,headContent;

var countryObj = {};
var sugar, salt, country;
var countries = ["Netherlands","Canada","Australia","France","Spain","South Africa","Germany","United Kingdom","United States"];
var saltCounter = [];
var sugarCounter = [];

r1.on('line' , function(line){

  if(header==0)
  {
    headContent = line.split(",");
    country = headContent.indexOf("countries_en");
    salt = headContent.indexOf("salt_100g");
    sugar = headContent.indexOf("sugars_100g");
    for(var i = 0; i < countries.length; i++){
      saltCounter.push(0);
      sugarCounter.push(0);
    }
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

      el = el.replace("\"","");
      var index = countries.indexOf(el);
      if(index!=-1)
      {
            if( countryObj[el] == undefined)
            {
              countryObj[el] = initCountryObj(lineArr[sugar], lineArr[salt]);
            }
            else{
              countryObj[el] = addToCountryObj(lineArr[sugar], lineArr[salt], countryObj[el]);
            }

            if(checkNan(lineArr[salt] )){
              saltCounter[index]++;
            }

            if(checkNan(lineArr[sugar])){
              sugarCounter[index]++;
            }

      }

    });
  }
  header++;

});

//for new country
function initCountryObj(salt, sugar){
  localObj = {
    'salt_100g' : (checkNan(salt)?parseFloat(salt):0),
    'sugars_100g' : (checkNan(sugar)?parseFloat(sugar):0)
  }

  return localObj;
}

//for existing country
function addToCountryObj(salt, sugar, object){
//  console.log(object);
  object['salt_100g'] += (checkNan(salt)?parseFloat(salt):0);
  object['sugars_100g'] += (checkNan(sugar)?parseFloat(sugar):0);

  return object;
}

function checkNan(value){

  if(value.trim()=="")
    return false;
  else
    return true;
}// checkNan


function  avg(saltCounter , sugarCounter , countryObj){

  var keys = Object.keys(countryObj);
  keys.forEach(function(el){

    var index = countries.indexOf(el);
    countryObj[el]["salt_100g"] /= saltCounter[index];
    countryObj[el]["sugars_100g"] /= sugarCounter[index];
  });

  return countryObj;
} //avg

r1.on('close',function(){
  var newCountryObj = avg(saltCounter , sugarCounter , countryObj);
  fs.writeFileSync('result.json',JSON.stringify(newCountryObj),'utf-8');
});
