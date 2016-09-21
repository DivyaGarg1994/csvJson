console.log("hello");
var fs = require("fs");
var readline = require("readline");

const r1 = readline.createInterface({
  input : fs.createReadStream("FoodFacts.csv")
});

var lines =[];
var header = 0,headContent;

var countryObj = {};
var sugar , salt ,country;
var countries = ["Netherlands","Canada","Australia","France","Spain","South Africa","Germany","United Kingdom","United States"];
var saltCounter = [0,0,0,0,0,0,0,0,0];
var sugarCounter = [0,0,0,0,0,0,0,0,0];

function fillSaltCounter(index){

  saltCounter[index]++;
}

function fillSugarCounter(index){

  sugarCounter[index]++;
}


r1.on('line' , (line) =>{

  if(header==0)
  {
    headContent = line.split(",");

  country = headContent.indexOf("countries_en");
  salt = headContent.indexOf("salt_100g");
  sugar = headContent.indexOf("sugars_100g");
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

    if(lineArr[salt].trim() == "")
      lineArr[salt] = 0;

      if(lineArr[sugar].trim() == "")
        lineArr[sugar] = 0;

        var conArr = lineArr[country].split("@@@");

        conArr.forEach(function(el){

          var index = countries.indexOf(el);
              if(index!=-1)
              {
                   var Obj = {};
                   if( countryObj[el] == undefined)
                     {
                       Obj[headContent[salt]] = parseFloat(lineArr[salt]);
                       Obj[headContent[sugar]] = parseFloat(lineArr[sugar]);
                       countryObj[el] = Obj;

                     }
                  else{
                    countryObj[el][headContent[salt]] += parseFloat(lineArr[salt]);
                    countryObj[el][headContent[sugar]] += parseFloat(lineArr[sugar]);
                  }

                  if(lineArr[salt] != 0)
                    fillSaltCounter(index);

                  if(lineArr[sugar] != 0)
                    fillSugarCounter(index);
              }

    });
  }


  header++;

});


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
