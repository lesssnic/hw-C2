
    const URL = 'https://bank.gov.ua/NBUStatService/v1/statdirectory/ovdp?json';

    let xhr = new XMLHttpRequest();

    xhr.open('GET', URL);

    xhr.onload = function(){

        let date = '2021-06-01'

        let data = JSON.parse(xhr.responseText);

        let mapData = new Map();

        for(let item of data){

            if (item.attraction <= 0){
                continue;
            }

            let rdate = item.repaydate.split('.').reverse().join('-');

            item.repaydate = rdate;

            if (rdate < date) {
                continue;
            }

            if (item.valcode == "USD"){
                item.attraction = item.attraction * 28;
                item.valcode = "UAH";
            }
            if (item.valcode == "EUR"){
                item.attraction = item.attraction * 33;
                item.valcode = "UAH";
            }
                
        if(mapData.has(item.repaydate)){

            let x = item.attraction + mapData.get(item.repaydate);
        
            mapData.set(item.repaydate, x);

        }else{

            mapData.set(item.repaydate, item.attraction);
                    
            }
              
        }
        
        let sortObjData = Object.fromEntries(mapData.entries());

        let sortArrData = Object.entries(sortObjData);

        sortArrData.sort();

        for(let attr = 0; attr < sortArrData.length; attr++){

            sortArrData[attr][0] = sortArrData[attr][0].split('-').reverse().join('.');

            console.log(`На ${sortArrData[attr][0]} Украина должна : ${sortArrData[attr][1]/1000_000} млн.грн.`);

        }         
                
    }

    xhr.send();
  