//Cerinta 1: preluare automată la pornirea aplicației a datelor curente despre 
//PIB pe cap de locuitor/ Speranta Viata / PopulațiePopulatie pentru țările UE pentru ultimii 15 ani 
//disponibili și procesare pentru aducerea la forma din fișierul furnizat

var listaTari = ['BE', 'BG', 'CZ', 'DK', 'DE', 'EE', 'IE', 'EL', 'ES', 'FR', 'HR', 'IT', 'CY', 'LV', 'LT', 'LU', 'HU', 'MT', 'NL', 'AT', 'PL', 'PT', 'RO', 'SI', 'SK', 'FI', 'SE'];
var listaAni = [2007, 2008, 2009, 2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021];
var listaIndicatori = ['POP', 'PIB', 'SV'];

function adaugareOptiuni(id, array) {

    select = document.getElementById(id);
    for (var i = 0; i < array.length; i++) {
        var optiune = document.createElement('option');
        optiune.value = array[i];
        optiune.innerHTML = array[i];
        select.appendChild(optiune)
    }
}

function populareSelecturi() {
    adaugareOptiuni("Tari", listaTari);
    adaugareOptiuni("Ani", listaAni);
    adaugareOptiuni("Indicatori", listaIndicatori);
}


class Tara {
    //nume, vector de valori pentru fiecare indicator

    constructor(nume, valoriPIB, valoriSV, valoriPOP) {
        this.nume = nume;
        this.valoriPIB = valoriPIB;
        this.valoriPOP = valoriPOP;
        this.valoriSV = valoriSV;
    }
}

var tari = []

var vectorGDP = []
var vectorSV = [];
var vectorPOP = [];

function preluareDate() {
    //fetch pib
    const req1 = fetch("https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/sdg_08_10?na_item=B1GQ&unit=CLV10_EUR_HAB&time=2007&time=2008&time=2009&time=2010&time=2011&time=2012&time=2013&time=2014&time=2015&time=2016&time=2017&time=2018&time=2019&time=2020&time=2021&geo=AT&geo=BE&geo=BG&geo=CY&geo=CZ&geo=DE&geo=DK&geo=EE&geo=EL&geo=ES&geo=FI&geo=FR&geo=HR&geo=HU&geo=IE&geo=IT&geo=LT&geo=LU&geo=LV&geo=MT&geo=NL&geo=PL&geo=PT&geo=RO&geo=SE&geo=SI&geo=SK&geo=SK&geo=LU")
        .then(rezultat => rezultat.json());

    //fetch sv
    const req2 = fetch("https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/demo_mlexpec?sex=T&age=Y1&time=2007&time=2008&time=2009&time=2010&time=2011&time=2012&time=2013&time=2014&time=2015&time=2016&time=2017&time=2018&time=2019&time=2020&time=2021&geo=AT&geo=BE&geo=BG&geo=CY&geo=CZ&geo=DE&geo=DK&geo=EE&geo=EL&geo=ES&geo=FI&geo=FR&geo=HR&geo=HU&geo=IE&geo=IT&geo=LT&geo=LU&geo=LV&geo=MT&geo=NL&geo=PL&geo=PT&geo=RO&geo=SE&geo=SI&geo=SK&geo=SK&geo=LU")
        .then(rezultat => rezultat.json());

    //fetch pop
    const req3 = fetch("https://ec.europa.eu/eurostat/api/dissemination/statistics/1.0/data/demo_pjan?sex=T&age=TOTAL&time=2007&time=2008&time=2009&time=2010&time=2011&time=2012&time=2013&time=2014&time=2015&time=2016&time=2017&time=2018&time=2019&time=2020&time=2021&geo=AT&geo=BE&geo=BG&geo=CY&geo=CZ&geo=DE&geo=DK&geo=EE&geo=EL&geo=ES&geo=FI&geo=FR&geo=HR&geo=HU&geo=IE&geo=IT&geo=LT&geo=LU&geo=LV&geo=MT&geo=NL&geo=PL&geo=PT&geo=RO&geo=SE&geo=SI&geo=SK&geo=SK&geo=LU")
        .then(rezultat => rezultat.json());

    const data = Promise.all([req1, req2, req3]);
    data.then((rezultat) => {
        GDP = rezultat[0];
        SV = rezultat[1];
        POP = rezultat[2];


        contor = 0;//numar de tari
        index_start = 0;
        index_stop = 15;
        while (contor <= 28 && index_stop < 15 * 27)  //pentru fiecare tara am 15 valori => 15*27 date in sectiunea "value" a JSON-ului
        {
            for (var i = index_start; i < index_stop; i++) {
                vectorGDP.push(GDP['value'][i]);

                if (SV['value'][i] != undefined)
                    vectorSV.push(SV['value'][i]);
                else
                    vectorSV.push(undefined);

                vectorPOP.push(POP['value'][i]);

            }

            tara = new Tara(listaTari[contor], vectorGDP, vectorSV, vectorPOP);

            tari.push(tara);
            vectorGDP = []
            vectorPOP = []
            vectorSV = []

            index_start = index_stop;
            index_stop += 15;

            contor++;
        }
    }
    );

}
//adaugarea functiei de perluare pe evenimentul onload al ferestrei
window.onload = function () {
    preluareDate();
    populareSelecturi();

}


//Cerinta 2: - afișare grafică evoluție pentru un indicator (PIB/SV/Pop) și o țară selectată 
//de către utilizator -
// se va folosi un element de tip SVG (grafică vectorială);  
//tipul de grafic (linie, histogramă, …) este la alegere 

selectTara = document.getElementById("Tari")
selectIndicator = document.getElementById("Indicatori")

//extrag valoarea care coresp indicatorului si tarii preluate din selectori
function extragereValoriDupaIndicatorSiTara(tara, indicator) {
    var valori = [];

    for (var i = 0; i < 26; i++) {

        if (tari[i].nume == tara) {
            if (indicator == 'POP') {
                valori = tari[i].valoriPOP;
            }
            else if (indicator == 'PIB') {
                valori = tari[i].valoriPIB;
            }
            else
                valori = tari[i].valoriSV;
        }
    }

    return valori;
}

var svgHeight = 600;
var svgWidth = 800;
var margine = 100;

//desenare dreptunghi corespunzator unor coordonate - colt stanga sus dreptunghi(x,y) si dimensiuni(width, height)
function desenareDreptunghi(svg, x, y, width, height) {
    var dreptunghi = document.createElementNS("http://www.w3.org/2000/svg", 'rect');
    dreptunghi.setAttributeNS(null, 'x', x);
    dreptunghi.setAttributeNS(null, 'y', y);
    dreptunghi.setAttributeNS(null, 'width', width);
    dreptunghi.setAttributeNS(null, 'height', height);
    dreptunghi.setAttributeNS(null, 'fill', "#A020F0");
    svg.appendChild(dreptunghi);
}

//desenare axe grafic(line) => apel de 2 ori pentru fiecare axa
function desenareAxe(svg, x1, y1, x2, y2, titlu) {

    var axa = document.createElementNS("http://www.w3.org/2000/svg", 'line');

    //x1, y1 = coordonate primul punct
    //x2, y2 = coordonate al doilea punct
    //linia = intre cele 2 puncte
    axa.setAttributeNS(null, "x1", x1);
    axa.setAttributeNS(null, "y1", y1);
    axa.setAttributeNS(null, "x2", x2);
    axa.setAttributeNS(null, "y2", y2);

    //console.log(x1+" "+y1+" "+x2+" "+y2)
    axa.style.stroke = "black";
    svg.appendChild(axa);
}

//desenare valori pe axe: 
//axa verticala : 3 valori (min, med, max); 
//axa orizontala: anii;


function desenareValori(svg, ani, valori, latime) {

    valori = valori.filter(x => x != undefined);
    var axa = svgHeight - 2 * margine;  //2*margine pt las loc cand desenez axele (o margine sus, o margine jos)
    var min = Math.min(...valori);
    var max = Math.max(...valori);
    var med = (min + max) / 2;

    //valori pe OY
    setareValoriOY(svg, margine - 70, axa + margine, min);
    setareValoriOY(svg, margine - 70, margine, max);
    setareValoriOY(svg, margine - 70, axa / 2 + margine, med);

    //valori pe OX - ani
    for (var i = 0; i < ani.length; i++) {
        x = margine + i * latime;
        y = axa + margine + 20;
        elem = document.createElementNS("http://www.w3.org/2000/svg", 'text');
        elem.setAttribute('x', x);
        elem.setAttribute('y', y);
        elem.setAttribute('textLength', 30);
        textNode = document.createTextNode(ani[i]);
        elem.appendChild(textNode);
        svg.appendChild(elem);
    }
    setareTitluGrafic(svg, margine, latime);
    setareNumeAxe(svg)
}
function setareNumeAxe(svg) {
    x = 400;
    y = 550;
    elem = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    elem.setAttribute('x', x);
    elem.setAttribute('y', y);
    elem.setAttribute('textLength', 50);
    elem.setAttribute('font-size', 20);
    textNode = document.createTextNode("Ani");
    elem.appendChild(textNode);
    svg.appendChild(elem);

    x = 720
    y = 420
    elem2 = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    elem2.setAttribute('x', x);
    elem2.setAttribute('y', y);
    elem2.setAttribute('textLength', 150);
    elem2.setAttribute('font-size', 20);
    textNode2 = document.createTextNode("Valoare indicator");
    elem2.appendChild(textNode2);
    svg.appendChild(elem2);


}
function setareValoriOY(svg, xVal, yVal, val) {
    elem = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    elem.setAttribute('x', xVal);
    elem.setAttribute('y', yVal);
    textNode = document.createTextNode(val);
    elem.appendChild(textNode);
    svg.appendChild(elem);
}
function setareTitluGrafic(svg, margine, latime) {

    x = 350;
    y = 40;
    elem = document.createElementNS("http://www.w3.org/2000/svg", 'text');
    elem.setAttribute('x', x);
    elem.setAttribute('y', y);
    elem.setAttribute('textLength', 250);
    elem.setAttribute('font-size', 20);
    textNode = document.createTextNode("Distributia indicatorului pe ani");
    elem.appendChild(textNode);
    svg.appendChild(elem);
}



//stergere copii din svg la reconstruirea graficului
function stergeGrafic(svg) {
    if (svg.lastChild) {
        while (svg.lastChild) {
            svg.removeChild(svg.lastChild);
        }
    }
}


//Cerinta 3: pentru graficul de la punctul anterior să se afișeze un tooltip care să afișeze 
// anul și valorile pentru PIB/SV/Pop pentru perioada corespunzătoare poziției mouse-ului 
//pentru cerinta 3: stochez datele intr-un obiect de tip dreptunghi pentru a putea compara coordonatele mouse-ului
// cu coordonatele, latime si inaltime ale dreptunghiului
//daca se incadreaza in dreptunghi, afisez valoarea si anul pentru dreptunghiul unde este pozitionat mouse-ul
class Dreptunghi {
    constructor(x, y, latime, inaltime, valoare, an) {
        this.x = x;
        this.y = y;

        this.latime = latime;
        this.inaltime = inaltime;

        this.valoare = valoare;
        this.an = an;
    }
}

var listaDreptunghiuri = [];

var svg = document.getElementById("grafic");
// creare SVGPoint
var pt = svg.createSVGPoint();

//preluare coordonate punct din SVG
function cursorPoint(e) {
    pt.x = e.clientX;
    pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
}
var butonDesenBarChart = document.getElementById("buton_barChart_svg");


butonDesenBarChart.onclick = function () {
    stergeGrafic(svg);

    var optiuneIndicator = selectIndicator.value;
    var optiuneTara = selectTara.value;


    var valori = [];
    valori = extragereValoriDupaIndicatorSiTara(optiuneTara, optiuneIndicator);


    var latimeDrept = (svgWidth - 2 * margine) / 15; //latime dreptunghi + spatiu intre dreptunghiuri
    var lungimeAxa = svgHeight - 2 * margine;   //lungime axa OY
    var hGrafic = svgHeight - margine;  //inaltime grafic = inaltimea SVG - marginea lasata sus
    var wGrafic = svgWidth - margine;  // latime grafic = latime SVG - marginea lasata jos


    //desenarea axelor
    //pe y
    desenareAxe(svg, margine, margine, margine, hGrafic); //(100 100) ; (100,500)
    //pe x
    desenareAxe(svg, margine, hGrafic, wGrafic, hGrafic); // (100,500) (continui de unde s-a oprit axa Oy) ; (500, 700)

    //desenarea valorilor de pe axe, nume axe, titlu grafic
    desenareValori(svg, listaAni, valori, latimeDrept);


    //desenarea dreptunghiurilor pentru bar chart

    valoriFiltrate = valori.filter(x => x != undefined);
    var max = Math.max(...valoriFiltrate);
    var min = Math.min(...valoriFiltrate);
    var pondereDrept = lungimeAxa / (max - min);    //ponderea se calculeaza ca fiind lungimea axei Oy : la diferenta dintre max si min
    //deci ponderea este cat semnifica o bucata din dreptunghiul desenat
    //ex: max= 81, min=77.7 => ponderea = 500 / 3.3 => o unitate inseamna 151,51 px

    for (var i = 0; i < valori.length; i++) {
        if (valori[i] != undefined) {
            var xdr = margine + (i * latimeDrept)

            var inaltimeDrept = parseFloat(pondereDrept * (valori[i] - min)) //ponderea * reprezentarea fata de minim(care e reprezentat fiind la nivelul axei OX)
            var ydr = hGrafic - inaltimeDrept //y dreptunghi = din inaltimea graficului scad inaltimea efectiva a dreptunghiului

            desenareDreptunghi(svg, xdr + 5, ydr, 0.8 * latimeDrept, inaltimeDrept);


            //pentru cerinta 3:
            var d = new Dreptunghi(xdr, ydr, latimeDrept, inaltimeDrept, valori[i], listaAni[i]);
            listaDreptunghiuri.push(d)

        }
        else
            var d = new Dreptunghi(xdr, ydr, 0, 0, undefined, listaAni[i]);
        listaDreptunghiuri.push(d)
    }

    //pentru cerinta 3:
    elem = document.createElementNS("http://www.w3.org/2000/svg", 'text');

    svg.addEventListener('mousemove', function (e) {
        var mouse = cursorPoint(e);

        listaDreptunghiuri.forEach(function (dr) {  //dr - elementul curent
            if (mouse.x > dr.x && mouse.y > dr.y) {

                //stergere scris anterior daca are noduri copil(adica TextNode-ul pe care il adaug mai jos)
                if (elem.hasChildNodes()) {
                    elem.removeChild(elem.childNodes[0]);
                }

                elem.setAttribute('x', dr.x);
                elem.setAttribute('y', dr.y - 20);
                elem.setAttribute('textLength', 200);
                elem.setAttribute('font-size', 15);

                textNode = document.createTextNode("An: " + dr.an + " Valoare: " + dr.valoare);

                elem.appendChild(textNode);
                svg.appendChild(elem);

            }

        });

    });

}

var butonDesenLineChart = document.getElementById("buton_lineChart_svg");
var svg = document.getElementById("grafic");
// creare SVGPoint
var pt = svg.createSVGPoint();

//preluare coordonate punct din SVG
function cursorPoint(e) {
    pt.x = e.clientX;
    pt.y = e.clientY;
    return pt.matrixTransform(svg.getScreenCTM().inverse());
}
butonDesenLineChart.onclick = function () {
    var svg = document.getElementById("grafic");
    stergeGrafic(svg);

    var optiuneIndicator = selectIndicator.value;
    var optiuneTara = selectTara.value;


    var valori = [];
    valori = extragereValoriDupaIndicatorSiTara(optiuneTara, optiuneIndicator);


    var latimeDrept = (svgWidth - 2 * margine) / 15; //latime dreptunghi + spatiu intre dreptunghiuri
    var lungimeAxa = svgHeight - 2 * margine;   //lungime axa OY
    var hGrafic = svgHeight - margine;  //inaltime grafic = inaltimea SVG - marginea lasata sus
    var wGrafic = svgWidth - margine;  // latime grafic = latime SVG - marginea lasata jos


    //desenarea axelor
    //pe y
    desenareAxe(svg, margine, margine, margine, hGrafic); //(100 100) ; (100,500)
    //pe x
    desenareAxe(svg, margine, hGrafic, wGrafic, hGrafic); // (100,500) (continui de unde s-a oprit axa Oy) ; (500, 700)

    //desenarea valorilor de pe axe, nume axe, titlu grafic
    desenareValori(svg, listaAni, valori, latimeDrept);


    //desenarea dreptunghiurilor pentru bar chart

    valoriFiltrate = valori.filter(x => x != undefined);
    var max = Math.max(...valoriFiltrate);
    var min = Math.min(...valoriFiltrate);
    var pondereDrept = lungimeAxa / (max - min);    //ponderea se calculeaza ca fiind lungimea axei Oy : la diferenta dintre max si min
    //deci ponderea este cat semnifica o bucatica din dreptunghiul desenat
    //ex: max= 81, min=77.7 => ponderea = 500 / 3.3 => o unitate inseamna 151,51 px

    for (var i = 0; i < valori.length; i++) {
        if (valori[i] != undefined) {
            var xdr = margine + (i * latimeDrept)

            var inaltimeDrept = parseFloat(pondereDrept * (valori[i] - min)) //ponderea * reprezentarea fata de minim(care e reprezentat fiind la nivelul axei OX)
            var ydr = hGrafic - inaltimeDrept //y dreptunghi = din inaltimea graficului scad inaltimea efectiva a dreptunghiului

            desenareDreptunghi(svg, xdr + 15, ydr, 0.05 * latimeDrept, inaltimeDrept);


            //pentru cerinta 3:
            var d = new Dreptunghi(xdr, ydr, latimeDrept, inaltimeDrept, valori[i], listaAni[i]);
            listaDreptunghiuri.push(d)

        }
        else
            var d = new Dreptunghi(xdr, ydr, 0, 0, undefined, listaAni[i]);
        listaDreptunghiuri.push(d)
    }

    //pentru cerinta 3:
    elem = document.createElementNS("http://www.w3.org/2000/svg", 'text');

    svg.addEventListener('mousemove', function (e) {
        var mouse = cursorPoint(e);

        listaDreptunghiuri.forEach(function (dr) {  //dr - elementul curent
            if (mouse.x > dr.x && mouse.y > dr.y) {

                //stergere scris anterior daca are noduri copil(adica TextNode-ul pe care il adaug mai jos)
                if (elem.hasChildNodes()) {
                    elem.removeChild(elem.childNodes[0]);
                }

                elem.setAttribute('x', dr.x);
                elem.setAttribute('y', dr.y - 20);
                elem.setAttribute('textLength', 200);
                elem.setAttribute('font-size', 15);

                textNode = document.createTextNode("An: " + dr.an + " Valoare: " + dr.valoare);

                elem.appendChild(textNode);
                svg.appendChild(elem);

            }

        });

    });
}

//Cerinta 6: afișare sub formă de tabel a datelor disponibile pentru un an selectat de către utilizator 
//(tarile pe linii și cei trei indicatori pe coloană); 
//fiecare celulă va primi o culoare (de la roșu la verde) în funcție de distanța față de media uniunii 


//extrag valoarea care coresp anului(preluat din select) si a indicatorului(apel de 3 ori pentru SV, POP, PIB)
function extragereValoriDupaIndicatorSiAn(indicator, an) {
    var valori = [];
    if (indicator == 'POP') {
        for (var i = 0; i < 26; i++) {
            valori.push(tari[i].valoriPOP[an - 2007]); //anul 2007 e pe poz 0 in vector, 2008 poz 1 etc
        }
    }
    else if (indicator == 'PIB') {
        for (var i = 0; i < 26; i++) {
            valori.push(tari[i].valoriPIB[an - 2007]);
        }
    }
    else {
        for (var i = 0; i < 26; i++) {
            valori.push(tari[i].valoriSV[an - 2007]);
        }

    }

    return valori;
}

function medieUniune(lista) {
    var medie = 0;
    var contorNull = 0;
    for (var i = 0; i < lista.length; i++) {
        if (lista[i] != undefined)
            medie += lista[i];
        else
            contorNull++;
    }

    medie /= (lista.length - contorNull);
    return medie;
}

selectAn = document.getElementById("Ani")
var buton_tabel = document.getElementById("buton_tabel");


function stergeTabel(tabel) {
    if (tabel.lastChild) {
        while (tabel.lastChild) {
            tabel.removeChild(tabel.lastChild);
        }
    }
}

var tabel = document.createElement("table");
buton_tabel.onclick = function () {

    var optiuneAn = selectAn.value;
    var listaValoriSV = [];
    var listaValoriPOP = [];
    var listaValoriPIB = [];
    
    var medieSV;
    var mediePOP;
    var mediePIB;

    listaValoriPIB = extragereValoriDupaIndicatorSiAn("PIB", optiuneAn);
    listaValoriPOP = extragereValoriDupaIndicatorSiAn("POP", optiuneAn);
    listaValoriSV = extragereValoriDupaIndicatorSiAn("SV", optiuneAn);


    mediePOP = medieUniune(listaValoriPOP);
    medieSV = medieUniune(listaValoriSV);
    mediePIB = medieUniune(listaValoriPIB);

    setLegendaTabel(medieSV, mediePOP, mediePIB);


    stergeTabel(tabel)
    tabel.style.border = "solid 4px black"
    tabel.style.textAlign = "center"
    tabel.setAttribute("id", "tabelDate")

    //populare cap tabel
    var capTabel = document.createElement("tr");
    capTabel.style.border = "solid 3px black";
    capTabel.style.backgroundColor = "#A020F0"
    capTabel.style.color = "white"
    capTabel.style.fontSize = "25px"


    var td = document.createElement("td");
    td.style.border = "solid 6px black";

    td.style.border = "solid 2px black";
    td.style.align = "center";
    td.style.valign = "middle";
    td = capTabel.insertCell();
    td.innerHTML = "Tara";

    td.style.border = "solid 2px black";
    td = capTabel.insertCell();
    td.innerHTML = "SV";

    td.style.border = "solid 2px black";
    td = capTabel.insertCell();
    td.innerHTML = "PIB";

    td.style.border = "solid 2px black";
    td = capTabel.insertCell();
    td.innerHTML = "POP";
    td.style.border = "solid 2px black";
    tabel.appendChild(capTabel);


    //populare linii tabel
    for (var i = 0; i < listaTari.length-1; i++) {
        var linie = document.createElement("tr");

        var td = document.createElement("td");

        //coloana tari
        td = linie.insertCell();
        td.innerHTML = listaTari[i];
        td.style.backgroundColor = "#A020F0"
        td.style.color = "white"
        td.style.fontSize = "25px"
        td.style.border = "solid 3px black";

        var variantaMaxima=(Math.max(...listaValoriSV)- medieSV).toFixed(2);
        var variantaMinima=( medieSV - Math.min(...listaValoriSV)).toFixed(2);
       
        //coloana SV
        td = linie.insertCell();
        td.innerHTML = listaValoriSV[i];
        td.style.border = "solid 1px black";
        td.style.fontSize = "20px"
        if (listaValoriSV[i] != null) {
            var x=(medieSV-listaValoriPIB[i])/1000000;
        
            if (listaValoriSV[i] == medieSV)
                td.style.backgroundColor = rgb(256,256,0);
            else if(listaValoriSV[i] < medieSV)
                td.style.backgroundColor = rgb(200-x,256,0);
            else if(listaValoriSV[i] > medieSV)
                td.style.backgroundColor = rgb(256,200+x,0);

        }


        //coloana PIB
        
        td = linie.insertCell();
        td.innerHTML = listaValoriPIB[i];
        td.style.border = "solid 1px black";
        td.style.fontSize = "20px"
        if (listaValoriPIB[i] != null) {

            var x=(mediePIB-listaValoriPIB[i])/100;


            if (listaValoriPIB[i] == mediePIB)
                td.style.backgroundColor = rgb(256,256,0);
            else if(listaValoriPIB[i] < mediePIB)
                td.style.backgroundColor = rgb(200-x,256,0);
            else if(listaValoriPIB[i] > mediePIB)
                td.style.backgroundColor = rgb(256,200+x,0);
            }
            

        //coloana POP
        td = linie.insertCell();
        td.innerHTML = listaValoriPOP[i];
        td.style.border = "solid 1px black";
        td.style.fontSize = "20px"
        if (listaValoriPOP[i] != null) {
           
            var x=(mediePOP-listaValoriPIB[i])/1000000;
 

            if (listaValoriPOP[i] == mediePOP)
                td.style.backgroundColor = rgb(256,256,0);
            else if(listaValoriPOP[i] < mediePOP)
                td.style.backgroundColor = rgb(200-x,256,0);
            else if(listaValoriPOP[i] > mediePOP)
                td.style.backgroundColor = rgb(256,200+x,0);
        }

        tabel.appendChild(linie);

    }

    document.body.appendChild(tabel);

}

function setLegendaTabel(medieSV, mediePOP, mediePIB) {
    element = document.getElementById("legenda");
 
    element.innerHTML = "Media Uniunii este: SV: " + medieSV.toFixed(2) + " PIB: " + mediePIB.toFixed(2) + " POP: " + mediePOP.toFixed(2) + "<br> Rosu: sub medie ; Verde: peste medie ; Gri: nu exista date";

    element.style.visibility = "visible";
}

function rgb(r, g, b){
    return "rgb("+r+","+g+","+b+")";
  }