import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';


@Component({
  selector: 'app-note-card-actions',
  templateUrl: './note-card-actions.component.html',
  styleUrls: ['./note-card-actions.component.scss']
})
export class NoteCardActionsComponent implements OnInit {

  @Input() i;
  @Output() oneditEvent = new EventEmitter();
  @Input() note;
  @Output() ondeleteEvent = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  public editEvent(event: Event) {
    console.log('edit clicked' + `{"note" : ${this.note},"id" : ${this.i}}`);
    event.stopPropagation();
    this.oneditEvent.emit({'note' : this.note, 'id' : this.i});
  }
  deleteEvent(event: Event) {
    console.log('delete clicked' + `{"note" : ${this.note},"id" : ${this.i}}`);
    event.stopPropagation();
    this.ondeleteEvent.emit({'note' : this.note, 'id' : this.i});
  }

}
