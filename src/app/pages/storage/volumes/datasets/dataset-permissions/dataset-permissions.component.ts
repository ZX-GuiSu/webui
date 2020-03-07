import { Component, OnDestroy } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { FieldSet } from 'app/pages/common/entity/entity-form/models/fieldset.interface';
import helptext from '../../../../../helptext/storage/volumes/datasets/dataset-permissions';
import { DialogService, StorageService, WebSocketService, UserService } from '../../../../../services/';
import { EntityJobComponent } from '../../../../common/entity/entity-job/entity-job.component';
import { T } from '../../../../../translate-marker';
import * as _ from 'lodash';

@Component({
  selector: 'app-dataset-permissions',
  template: `<entity-form [conf]="this"></entity-form>`
})
export class DatasetPermissionsComponent implements OnDestroy {

  protected updateCall = 'pool.dataset.permission';
  protected datasetPath: string;
  protected datasetId: string;
  protected recursive: any;
  protected recursive_subscription: any;
  public formGroup: FormGroup;
  public error: string;
  protected route_success: string[] = ['storage', 'pools'];
  protected isEntity = true;
  protected userOnLoad: string;
  protected groupOnLoad: string;
  protected dialogRef: any;
  private entityForm: any;

  public fieldSets: FieldSet[] = [
    {
      name: helptext.heading_dataset_path,
      label: true,
      config: [
        {
          type: 'input',
          name: 'id',
          placeholder: helptext.dataset_permissions_id_placeholder,
          readonly: true
        }
      ],
      width: '100%'
    },
    {
      name: 'divider',
      divider: true
    },
    {
      name: helptext.heading_owner,
      label: true,
      config: [
        {
          type: 'combobox',
          name: 'user',
          placeholder: helptext.dataset_permissions_user_placeholder,
          tooltip: helptext.dataset_permissions_user_tooltip,
          options: [],
          searchOptions: [],
          parent: this,
          updater: this.updateUserSearchOptions,
        },
        {
          type: 'combobox',
          name: 'group',
          placeholder: helptext.dataset_permissions_group_placeholder,
          tooltip: helptext.dataset_permissions_group_tooltip,
          options: [],
          searchOptions: [],
          parent: this,
          updater: this.updateGroupSearchOptions,
        }
      ],
      width: '50%'
    },
    {
      name: helptext.heading_access,
      label: true,
      config: [
        {
          type: 'permissions',
          name: 'mode',
          placeholder: helptext.dataset_permissions_mode_placeholder,
          tooltip: helptext.dataset_permissions_mode_tooltip,
          isHidden: false
        }
      ],
      width: '50%'
    },
    {
      name: 'divider',
      divider: true
    },
    {
      name: helptext.heading_advanced,
      label: true,
      config: [
        {
          type: 'checkbox',
          name: 'recursive',
          placeholder: helptext.dataset_permissions_recursive_placeholder,
          tooltip: helptext.dataset_permissions_recursive_tooltip,
          value: false
        },
        {
          type: 'checkbox',
          name: 'traverse',
          placeholder: helptext.dataset_permissions_traverse_placeholder,
          tooltip: helptext.dataset_permissions_traverse_tooltip,
          value: false
        }
      ],
      width: '100%'
    },
    {
      name: 'divider',
      divider: true
    }
  ];
  protected datasetMode: any;

  constructor(
    protected aroute: ActivatedRoute,
    protected ws: WebSocketService,
    protected userService: UserService,
    protected storageService: StorageService,
    protected mdDialog: MatDialog,
    protected dialog: DialogService,
    protected router: Router) { }

  preInit(entityEdit: any) {
    entityEdit.isNew = true; // remove me when we find a way to get the permissions
    this.aroute.params.subscribe(params => {
      this.datasetId = params['pk'];
      this.datasetPath = '/mnt/' + this.datasetId;
      const idField = _.find(this.fieldSets.find(set => set.name === helptext.heading_dataset_path).config, { name: 'id' });
      idField.value = this.datasetPath;
    });

    this.userService.userQueryDSCache().subscribe(items => {
      const users = [];
      for (let i = 0; i < items.length; i++) {
        users.push({ label: items[i].username, value: items[i].username });
      }
      const userField = _.find(this.fieldSets.find(set => set.name === helptext.heading_owner).config, { 'name': 'user' });
      userField.options = users;
    });

    this.userService.groupQueryDSCache().subscribe(items => {
      const groups = [];
      for (let i = 0; i < items.length; i++) {
        groups.push({ label: items[i].group, value: items[i].group });
      }
      const groupField = _.find(this.fieldSets.find(set => set.name === helptext.heading_owner).config, { 'name': 'group' });
      groupField.options = groups;
    });
  }

  afterInit(entityEdit: any) {
    this.entityForm = entityEdit;
    this.storageService.filesystemStat(this.datasetPath).subscribe(res => {
      this.userOnLoad = res.user;
      this.groupOnLoad = res.group;
      this.datasetMode = res.mode.toString(8).substring(2, 5);
      entityEdit.formGroup.controls['mode'].setValue(this.datasetMode);
      entityEdit.formGroup.controls['user'].setValue(res.user);
      entityEdit.formGroup.controls['group'].setValue(res.group);
    });
    this.recursive = entityEdit.formGroup.controls['recursive'];
    this.recursive_subscription = this.recursive.valueChanges.subscribe((value) => {
      if (value === true) {
        this.dialog.confirm(T("Warning"), T("Setting permissions recursively will affect this directory and any others below it. This might make data inaccessible."))
          .subscribe((res) => {
            if (!res) {
              this.recursive.setValue(false);
            }
          });
      }
    });
  }

  ngOnDestroy() {
    this.recursive_subscription.unsubscribe();
  }

  updateGroupSearchOptions(value = "", parent) {
    parent.userService.groupQueryDSCache(value).subscribe(items => {
      const groups = [];
      for (let i = 0; i < items.length; i++) {
        groups.push({ label: items[i].group, value: items[i].group });
      }
      parent.group.searchOptions = groups;
    });
  }

  updateUserSearchOptions(value = "", parent) {
    parent.userService.userQueryDSCache(value).subscribe(items => {
      const users = [];
      for (let i = 0; i < items.length; i++) {
        users.push({ label: items[i].username, value: items[i].username });
      }
      parent.user.searchOptions = users;
    });
  }

  beforeSubmit(data) {
    if (data.user === this.userOnLoad) {
      delete data.user;
    };
    if (data.group === this.groupOnLoad) {
      delete data.group;
    }
    data['acl'] = [];

    data['options'] = {
      'stripacl': true,
      'recursive': data['recursive'],
      'traverse': data['traverse'],
    };
    delete data['recursive'];
    delete data['traverse'];

    if (data['mode'] === this.datasetMode) {
      delete data['mode'];
      data['options']['stripacl'] = false;
    }

  }

  customSubmit(data) {
    this.dialogRef = this.mdDialog.open(EntityJobComponent, { data: { "title": T("Saving Permissions") }});
    this.dialogRef.componentInstance.setDescription(T("Saving Permissions..."));
    this.dialogRef.componentInstance.setCall(this.updateCall, [this.datasetId, data]);
    this.dialogRef.componentInstance.submit();
    this.dialogRef.componentInstance.success.subscribe((res) => {
      this.entityForm.success = true;
      this.dialogRef.close();
      this.router.navigate(new Array('/').concat(
        this.route_success));
    });
    this.dialogRef.componentInstance.failure.subscribe((err) => {
      console.error(err)
    });
  }
}
