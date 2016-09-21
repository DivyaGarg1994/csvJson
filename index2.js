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


// if(countries.indexOf("Canada")!=-1)
//   console.log("------------true----------");


r1.on('line' , (line) =>{

  if(header==0)
  {
    headContent = line.split(",");

  country = headContent.indexOf("countries_en");
  carbo = headContent.indexOf("carbohydrates_100g");
  protein = headContent.indexOf("proteins_100g");
  fat = headContent.indexOf("fat_100g")
// console.log("---------------------"+salt);
// console.log("---------------------"+sugar);


    for(var key in countryObj){
        if(countryObj.hasOwnProperty(key)){
          countryObj[key][headContent[fat]] = 0;
          countryObj[key][headContent[carbo]] = 0;
          countryObj[key][headContent[protein]] = 0;

          console.log(countryObj);
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

            if(countries1.indexOf(el)!=-1)
            {

                  countryObj["North Europe"][headContent[fat]] += parseFloat(lineArr[fat]);
                  countryObj["North Europe"][headContent[carbo]] += parseFloat(lineArr[carbo]);
                  countryObj["North Europe"][headContent[protein]] += parseFloat(lineArr[protein]);

                    //console.log(countryObj);
            }

            else if(countries2.indexOf(el)!=-1)
            {

              countryObj["Central Europe"][headContent[fat]] += parseFloat(lineArr[fat]);
              countryObj["Central Europe"][headContent[carbo]] += parseFloat(lineArr[carbo]);
              countryObj["Central Europe"][headContent[protein]] += parseFloat(lineArr[protein]);

                  //  console.log(countryObj);
            }

            else if(countries3.indexOf(el)!=-1)
            {

              countryObj["South Europe"][headContent[fat]] += parseFloat(lineArr[fat]);
              countryObj["South Europe"][headContent[carbo]] += parseFloat(lineArr[carbo]);
              countryObj["South Europe"][headContent[protein]] += parseFloat(lineArr[protein]);

                //    console.log(countryObj);
            }
        });
  }


  header++;

});


r1.on('close',function(){
  console.log(countryObj);
	fs.writeFileSync('result2.json',JSON.stringify(countryObj),'utf-8');
});
