import { Injectable } from '@angular/core';
import * as am4core from "@amcharts/amcharts4/core";

@Injectable()
export class AmchartsCustomThemeService {

    am4themes_myTheme(target:any) {
        if (target instanceof am4core.ColorSet) {
            // dark green - light green
            // target.list = [
            //     am4core.color("#00AB08"),
            //     am4core.color("#00C301"),
            //     am4core.color("#26D701"),
            //     am4core.color("#4DED30"),
            //     am4core.color("#95F985"),
            //     am4core.color("#B7FFBF")
            // ];
            // green to yellow
            // target.list = [
            //     am4core.color("#5faa46"),
            //     am4core.color("#86b941"),
            //     am4core.color("#aec83d"),
            //     am4core.color("#c9d139"),
            //     am4core.color("#d6d638"),
            //     am4core.color("#e5dc36")
            // ];
            target.list = [
                am4core.color("#C086EA"),
                am4core.color("#A1BEF7"),
                am4core.color("#F1AA93"),
                am4core.color("#F1AA93"),
                am4core.color("#7EC4C9"),
                am4core.color("#74CCE7"),
            ];
        }
    }
    getRandomColors(){
        let colorArray = ['#a4c9d0','#A1BEF7','#F1AA93','#C6D7FA','#F8D5C9','#E4CBF6','#FAE2DA','#D9E4FC','#F2E5FB']
        return  colorArray[Math.floor(Math.random()*colorArray.length)];
    }
}