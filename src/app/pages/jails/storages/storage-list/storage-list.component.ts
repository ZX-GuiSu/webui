import { Component } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { DialogService, WebSocketService } from '../../../../services';
import { AppLoaderService } from '../../../../services/app-loader/app-loader.service';
import { Subscription } from 'rxjs';
import { EntityUtils } from '../../../common/entity/utils';
import { T } from '../../../../translate-marker';
import helptext from '../../../../helptext/jails/storage';

@Component({
  selector: 'app-storage-list',
  template: `<entity-table [title]="title" [conf]="this"></entity-table>`
})
export class StorageListComponent {

  public title;
  protected queryCall = 'jail.fstab';
  protected queryCallOption = [];
  protected queryRes: any = [];
  protected route_add: string[] = ['jails', 'storage'];
  protected route_delete: string[] = ['jails', 'storage'];
  protected route_edit: string[] = ['jails', 'storage'];

  protected jailId: string;
  public busy: Subscription;
  protected loaderOpen: boolean = false;

  public columns: Array < any > = [
    { name: T('Source'), prop: 'source', always_display: true },
    { name: T('Destination'), prop: 'destination' },
  ];
  public rowIdentifier = 'source';
  public config: any = {
    paging: true,
    sorting: { columns: this.columns },
    deleteMsg: {
      title: 'Mount Point',
      key_props: ['source', 'destination']
    },
  };
  protected entityList: any;

  constructor(protected router: Router, protected aroute: ActivatedRoute, protected dialog: DialogService,
              protected loader: AppLoaderService, protected ws: WebSocketService,
              protected translate: TranslateService) {
    this.aroute.params.subscribe(params => {
      this.jailId = params['jail'];
      this.queryCallOption.push(params['jail']);
      this.queryCallOption.push({ "action": "LIST", "source": "", "destination": "", "fstype": "", "fsoptions": "", "dump": "", "pass": "" });
      this.route_add.push(params['jail'], 'add');
      this.route_delete.push(params['jail'], 'delete');
      this.route_edit.push(params['jail'], 'edit');
      this.translate.get(T('Mount Points of ')).subscribe(
        (res) => {
            this.title = res + this.jailId;
        }
      );
    });
  }

  afterInit(entityTable) {
    this.entityList = entityTable;
    entityTable.doDelete = this.doDelete;
    entityTable.jailId = this.jailId;
    entityTable.dialog = this.dialog;
    this.getData = entityTable.getData;
  }

  dataHandler(entityList: any) {
    entityList.rows = [];

    if (this.queryRes[0]) {
      for(let i in this.queryRes[0]) {
        if (this.queryRes[0][i].type && this.queryRes[0][i].type != "SYSTEM") {
          let row = [];
          row['source'] = this.queryRes[0][i].entry[0];
          row['destination'] = this.queryRes[0][i].entry[1];
          row['fstype'] = this.queryRes[0][i].entry[2];
          row['fsoptions'] = this.queryRes[0][i].entry[3];
          row['dump'] = this.queryRes[0][i].entry[4];
          row['_pass'] = this.queryRes[0][i].entry[5];
          row['id'] = i;
          entityList.rows.push(row);
        }
      }
    }
  }

  getData () {

  }

  doDelete(item) {
    this.ws.call('jail.query', [
      [
        ["host_hostuuid", "=", this.jailId]
      ]
    ]).subscribe((res) => {
      if (res[0] && res[0].state == 'up') {
        this.dialog.Info(T('Delete Mountpoint'), "<i>" + this.jailId + T("</i> cannot be running when deleting a mountpoint."), '500px', 'info', true);
      } else {
        let deleteMsg =  "Delete Mount Point <b>" + item['source'] + '</b>?';
        this.translate.get(deleteMsg).subscribe((res) => {
          deleteMsg = res;
        });
        this.dialog.confirm(T("Delete"), deleteMsg, false, T('Delete Mount Point')).subscribe((res) => {
          if (res) {
            this.loader.open();
            this.loaderOpen = true;
            let data = {};
            this.busy = this.ws.call('jail.fstab', [this.jailId, { "action": "REMOVE", "index": item.id}]).subscribe(
              (res) => { this.getData() },
              (res) => {
                new EntityUtils().handleWSError(this, res, this.dialog);
                this.loader.close();
              }
            );
          }
        })
      }
    })
  }

  getAddActions() {
    return [{
      label: T("Go Back to Jails"),
      onClick: () => {
        this.router.navigate(new Array('').concat(['jails']));
      }
    }];
  }

  doAdd() {
    this.ws.call('jail.query', [
      [
        ["host_hostuuid", "=", this.jailId]
      ]
    ]).subscribe((res) => {
      if (res[0] && res[0].state == 'up') {
        this.dialog.Info(T('Add Mountpoint'), "<i>" + this.jailId + "</i> cannot be running when adding a mountpoint.", '500px', 'info', true);
      } else {
        this.router.navigate(new Array('/').concat(this.route_add));
      }
    })
  }

  getActions(row) {
    const rowName = row.source.replace("/mnt/", "");
    const poolName = rowName.split('/')[0];
    let optionDisabled;
    rowName.includes('/') ? optionDisabled = false : optionDisabled = true;
    return [
      {
        name: 'edit',
        id: "edit",
        icon: 'edit',
        label: T("Edit"),
        onClick: (rowinner) => { this.entityList.doEdit(rowinner.id); },
      }, {
        id: row.name,
        icon: 'security',
        name: "edit_acl",
        disabled: optionDisabled,
        matTooltip: helptext.acl_edit_msg,
        label: helptext.action_edit_acl,
        onClick: (rowinner) => {
          const datasetId = rowName;
          this.router.navigate(
            ["/"].concat(["storage", "pools", "id", poolName, "dataset", "acl", datasetId]));
        }
      }, {
        name: 'delete',
        id: "delete",
        icon: 'delete',
        label: T("Delete"),
        onClick: (rowinner) => { this.entityList.doDelete(rowinner); },
      }
    ]
  }
}
