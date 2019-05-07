import { Component, Input, OnInit } from "@angular/core";
import { ResourceService } from "@sunbird/shared";
@Component({
  selector: "app-activitytype-card",
  templateUrl: "./show-activitytype.component.html",
  styleUrls: ["./show-activitytype.component.css"]
})
export class ActivitytypeCardComponent implements OnInit {
  @Input() activitytypecount: any;
  public resourceService: ResourceService;
  constructor(resourceService: ResourceService) {
    this.resourceService = resourceService;
  }
  ngOnInit() {
    debugger;
  }
}
