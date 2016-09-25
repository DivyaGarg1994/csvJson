
var fs = require("fs");
var readline = require("readline");

const r1 = readline.createInterface({
  input : fs.createReadStream("FoodFacts.csv")
});

var lines =[];
var header = 0, headContent;

var countryObj = {
  "carbo":[],
  "fat":[],
  "protein":[]
};

var countryArr = [{"region":"North Europe" , "ingreValue":0},
                  {"region":"Central Europe" , "ingreValue":0},
                  {"region":"South Europe" , "ingreValue":0}
                ];

var fat, protein, carbo;

var countries1 = ["United Kingdom","Denmark","Sweden","Norway"];
var countries2 = ["France","Belgium","Germany","Switzerland","Netherlands"];
var countries3 = ["Portugal","Greece","Italy","Spain","Croatia","Albania"];

var carboCounter = [];
var proteinCounter = [];
var fatCounter = [];

var keys;

/* returns region */
  function checkRegion(el){

    if(countries1.indexOf(el)!=-1)
      return "North Europe";
    else if(countries2.indexOf(el)!=-1)
      return "Central Europe";
    else if(countries3.indexOf(el)!=-1)
      return "South Europe";
    else
      return null;
  }

/* return index of the area for counter array */
  function regionCount(region){
    if(region == "North Europe")
      return 0;
    else if(region == "Central Europe")
      return 1;
    else if(region == "South Europe")
      return 2;
  }

/* insert value of the ingredient */
function insert(arr,ingre,region){

  for(var i=0 ; i< 3 ; i++){

      if(arr[i]["region"] == region){
        arr[i]["ingreValue"] += parseFloat(ingre);
      }
  }
  return arr;
}


/* --- checks type of ingredient and calls function to insert value */
  function insertValue(type, ingre , region){

    newCountryObj = countryObj
      var count = regionCount(region);

        if(type=="carbo")
          {
            var valueArr = countryObj["carbo"];
            countryObj["carbo"] = insert(valueArr,ingre,region);
            carboCounter[count]++;
        }

        else if(type=="protein")
        {
            var valueArr = countryObj["protein"];
            countryObj["protein"] = insert(valueArr,ingre,region);
            proteinCounter[count]++;
        }
        else if(type=="fat")
        {
            var valueArr = countryObj["fat"];
            countryObj["fat"] = insert(valueArr,ingre,region);
            fatCounter[count]++;
        }

  }//insertValue ends here



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

      countryObj[key] = [{"region":"North Europe" , "ingreValue":0},
                        {"region":"Central Europe" , "ingreValue":0},
                        {"region":"South Europe" , "ingreValue":0}
                      ];
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

    //  iterate through array after splitting
      conArr.forEach(function(el){
        el = el.replace("\"","");
        var area = checkRegion(el);

        if(area != null)
        {
          if(checkNaN(lineArr[fat]))
            insertValue("fat",lineArr[fat] , area);

          if(checkNaN(lineArr[carbo]))
            insertValue("carbo",lineArr[carbo] , area);

          if(checkNaN(lineArr[protein]))
              insertValue("protein",lineArr[protein] , area);
        } //if checkRegion

      }); // conArr
  }
  header++;

});


r1.on('close',function(){
  var newCountryObj = avg(carboCounter , fatCounter , proteinCounter , countryObj);
  fs.writeFileSync('result2.json',JSON.stringify(newCountryObj),'utf-8');
});


//calculate average
function  avg(carboCounter , fatCounter , proteinCounter , countryObj){

  var keys = Object.keys(countryObj);

  keys.forEach(function(ingredient){
      valueObj = countryObj[ingredient];

      valueObj.forEach(function(ing){
        var count = regionCount(ing["region"]);
            if(ingredient=="carbo")
              ing["ingreValue"] /= carboCounter[count];
            else if(ingredient=="protein")
              ing["ingreValue"] /= proteinCounter[count];
            else if(ingredient=="fat")
              ing["ingreValue"] /= fatCounter[count];
      });

  });//keys for each

  return countryObj;
} //avg


// if value is ""
function checkNaN(value){

  if(value.trim()=="")
    return false;
  else
    return true;
}// checkNaN
