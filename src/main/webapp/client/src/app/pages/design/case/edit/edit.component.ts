import {Component, ViewEncapsulation, NgModule, Pipe, OnInit, AfterViewInit} from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { NgUploaderModule } from 'ngx-uploader';

import {GlobalState} from '../../../../global.state';

import { CONSTANT } from '../../../../utils/constant';
import { Utils } from '../../../../utils/utils';
import {ValidatorUtils} from '../../../../validator/validator.utils';
import { RouteService } from '../../../../service/route';

import { NodeEvent } from '../../../../components/ng2-tree/src/tree.events';
import { TreeService } from '../../../../components/ng2-tree/src/tree.service';

import {FieldType, CustomFieldDefinition, CustomFieldModel, FieldChangedEvent } from '../../../../components/custom-field';

import { CaseService } from '../../../../service/case';

declare var jQuery;

@Component({
  selector: 'case-edit',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./edit.scss'],
  templateUrl: './edit.html'
})
export class CaseEdit implements OnInit, AfterViewInit {
  id: number;
  model: any = {};
  settings: any;
  data: any;
  form: any;
  tab: string = 'steps';

  public fieldDefine: CustomFieldDefinition = {fieldType: FieldType.text};
  public fieldModel: CustomFieldModel = {value: '张三'};

  constructor(private _state:GlobalState, private _routeService: RouteService, private _route: ActivatedRoute, private fb: FormBuilder,
              private treeService: TreeService, private _caseService: CaseService) {

  }
  ngOnInit() {
    let that = this;

    that._route.params.forEach((params: Params) => {
      that.id = +params['id'];
    });

    if (that.id) {
      that.loadData();
    }
    that.buildForm();

    this._state.subscribe('case.change', (testCase) => {
      that.id = testCase.id;
      that.loadData();
    });


    this.data = [
      {
        id: 1,
        ordr: 1,
        opt: 'Leanne Graham',
        expect: 'Lorem ipsum dolor sit amet, ex dolorem officiis convenire usu.'
      },
      {
        id: 2,
        ordr: 2,
        opt: 'Ervin Howell',
        expect: `Vix iudico graecis in? Malis eirmod consectetuer duo ut?
                Mel an aeterno vivendum accusata, qui ne amet stet definitiones.`
      },
      {
        id: 3,
        ordr: 3,
        opt: 'Clementine Bauch',
        expect: 'Mollis latine intellegebat ei usu, veri exerci intellegebat vel cu. Eu nec ferri copiosae.'
      }
    ];

    this.settings = {
      columns: {
        ordr: {
          title: '顺序',
        },
        opt: {
          title: '操作',
          editor: {
            type: 'textarea'
          },
        },
        expect: {
          title: '期望结果',
          editor: {
            type: 'textarea',
          },
        }
      },
    };
  }
  ngAfterViewInit() {}

  buildForm(): void {
    let that = this;
    this.form = this.fb.group(
      {
        'title': ['', [Validators.required]],
        'objective': ['', [Validators.required]]
      }, {}
    );

    this.form.valueChanges.subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }
  onValueChanged(data?: any) {
    let that = this;
    that.formErrors = ValidatorUtils.genMsg(that.form, that.validateMsg, []);
  }

  formErrors = [];
  validateMsg = {
    'title': {
      'required':      '简介不能为空'
    },
    'objective': {
      'required':      '描述不能为空'
    }
  };

  loadData() {
    let that = this;
    that._caseService.get(that.id).subscribe((json:any) => {
      that.model = json.data;
    });
  }

  save() {
    let that = this;

    that._caseService.save(that.model).subscribe((json:any) => {
      if (json.code == 1) {
        that.model = json.data;
      }
    });
  }

  tabChange(event: any) {
    this.tab = event.nextId;
  }

  onUpConfirm(event: any) {
    console.log('onUpConfirm', event);
    event.confirm.resolve();
  }

  onDownConfirm(event: any) {
    console.log('onDownConfirm', event);
    event.confirm.resolve();
  }

  onCreateConfirm(event: any) {
    console.log('onCreateConfirm', event);
    event.confirm.resolve();
  }
  onSaveConfirm(event: any) {
    console.log('onSaveConfirm', event);
    event.confirm.resolve();
  }
  onDeleteConfirm(event: any) {
    console.log('onDeleteConfirm', event);
    event.confirm.resolve();
  }

}

