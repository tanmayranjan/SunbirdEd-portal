import { Component, OnInit } from '@angular/core';

@Component({
 selector: 'app-top-categories',
 templateUrl: './top-categories.component.html',
 styleUrls: ['./top-categories.component.scss']
})
export class TopCategoriesComponent implements OnInit {
categories = [
  'Cloud Computing', 'Big Data' , 'DevOps' , 'DataScience' , 'Mobile Developement' , 'Project Management and Methodologies'
, 'Cloud Computing', 'Big Data' , 'DevOps' , 'DataScience' , 'Mobile Developement' , 'Project Management and Methodologies',
'Cloud Computing', 'Big Data' , 'DevOps' , 'DataScience' , 'Mobile Developement' , 'Project Management and Methodologies'
];
 constructor() { }

 ngOnInit() {
 }

}
