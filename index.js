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

// if(countries.indexOf("Canada")!=-1)
//   console.log("------------true----------");


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



//console.log("Before "+line.split(",").length);
    while((arr = regex.exec(line))){
    //  console.log(arr[0]);
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


              if(countries.indexOf(el)!=-1)
              {
                   var Obj = {};
                   if( countryObj[el] == undefined)
                     {
                       Obj[headContent[salt]] = parseFloat(lineArr[salt]);
                       Obj[headContent[sugar]] = parseFloat(lineArr[sugar]);
                       countryObj[el] = Obj;
                       //console.log(countryObj)
                     }
                  else{
                    countryObj[el][headContent[salt]] += parseFloat(lineArr[salt]);
                    countryObj[el][headContent[sugar]] += parseFloat(lineArr[sugar]);
                  }
                //  console.log(countryObj);
              }
    // console.log("------------------------------------------------------------------------------");
    // console.log(countryObj);

  })
  }


  header++;

});


r1.on('close',function(){
  console.log(countryObj);
	fs.writeFileSync('result.json',JSON.stringify(countryObj),'utf-8');
});
