import { NgModule } from '@angular/core';
import {CommonModule} from "@angular/common";

import {FilterRightPipe} from "./right.pipe"; // <---

@NgModule({
  declarations:[FilterRightPipe], // <---
  imports:[CommonModule],
  exports:[FilterRightPipe] // <---
})

export class MainPipe{}