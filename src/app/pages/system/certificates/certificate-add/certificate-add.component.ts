import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import * as _ from 'lodash';
import { RestService, SystemGeneralService, WebSocketService } from '../../../../services/';
import { MatDialog } from '@angular/material/dialog';
import { EntityJobComponent } from '../../../common/entity/entity-job/entity-job.component';
import { FieldConfig } from '../../../common/entity/entity-form/models/field-config.interface';
import { EntityUtils } from '../../../common/entity/utils';
import { helptext_system_certificates } from 'app/helptext/system/certificates';
import { helptext_system_ca } from 'app/helptext/system/ca';

@Component({
  selector : 'system-certificate-add',
  template : `<entity-form [conf]="this"></entity-form>`,
  providers : [ SystemGeneralService ]
})

export class CertificateAddComponent {

  protected addCall = "certificate.create";
  protected route_success: string[] = [ 'system', 'certificates' ];
  protected isEntity: boolean = true;
  protected dialogRef: any;
  private entityForm: any;
  private CSRList = [];
  protected fieldConfig: FieldConfig[] = [
    {
      type : 'input',
      name : 'name',
      placeholder : helptext_system_certificates.add.name.placeholder,
      tooltip: helptext_system_certificates.add.name.tooltip,
      required: true,
      validation : helptext_system_certificates.add.name.validation,
      hasErrors: false,
      errors: 'Allowed characters: letters, numbers, underscore (_), and dash (-).'
    },
    {
      type : 'select',
      name : 'create_type',
      placeholder : helptext_system_certificates.add.create_type.placeholder,
      options : [
        {label: 'Internal Certificate', value: 'CERTIFICATE_CREATE_INTERNAL'},
        {label: 'Certificate Signing Request', value: 'CERTIFICATE_CREATE_CSR'},
        {label: 'Import Certificate', value: 'CERTIFICATE_CREATE_IMPORTED'},
        {label: 'Import Certificate Signing Request', value: 'CERTIFICATE_CREATE_IMPORTED_CSR'},
      ],
      value: 'CERTIFICATE_CREATE_INTERNAL',
    },
    {
      type : 'checkbox',
      name : 'csronsys',
      placeholder : helptext_system_certificates.add.isCSRonSystem.placeholder,
      tooltip: helptext_system_certificates.add.isCSRonSystem.tooltip,
      isHidden: true,
      disabled: true,
    },
    {
      type : 'select',
      name : 'csrlist',
      placeholder : helptext_system_certificates.add.signedby.placeholder,
      tooltip: helptext_system_certificates.add.signedby.tooltip,
      options : [
        {label: '---', value: null}
      ],
      isHidden: true,
      disabled: true,
      required: true,
      validation: helptext_system_certificates.add.signedby.validation,
      relation : [
        {
          action : 'ENABLE',
          when : [ {
            name : 'csronsys',
            value : true,
          } ]
        },
      ]
    },
    {
      type : 'select',
      name : 'signedby',
      placeholder : helptext_system_certificates.add.signedby.placeholder,
      tooltip: helptext_system_certificates.add.signedby.tooltip,
      options : [
        {label: '---', value: null}
      ],
      isHidden: true,
      disabled: true,
      required: true,
      validation: helptext_system_certificates.add.signedby.validation,
    },
    {
      type : 'select',
      name : 'key_type',
      placeholder : helptext_system_certificates.add.key_type.placeholder,
      tooltip: helptext_system_ca.add.key_type.tooltip,
      options : [
        {label: 'RSA', value: 'RSA'},
        {label: 'EC', value: 'EC'}
      ],
      value: 'RSA',
      isHidden: false,
      disabled: true,
      required: true,
      validation: helptext_system_certificates.add.key_type.validation
    },
    {
      type : 'select',
      name : 'ec_curve',
      placeholder : helptext_system_certificates.add.ec_curve.placeholder,
      tooltip: helptext_system_ca.add.ec_curve.tooltip,
      options : [
        {label: 'BrainpoolP512R1', value: 'BrainpoolP512R1'},
        {label: 'BrainpoolP384R1', value: 'BrainpoolP384R1'},
        {label: 'BrainpoolP256R1', value: 'BrainpoolP256R1'},
        {label: 'SECP256K1', value: 'SECP256K1'},
      ],
      value: 'BrainpoolP384R1',
      isHidden: true,
      disabled: true,
      relation : [
        {
          action : 'ENABLE',
          when : [ {
            name : 'key_type',
            value : 'EC',
          } ]
        },
      ]
    },
    {
      type : 'select',
      name : 'key_length',
      placeholder : helptext_system_certificates.add.key_length.placeholder,
      tooltip: helptext_system_certificates.add.key_length.tooltip,
      options : [
        {label : '1024', value : 1024},
        {label : '2048', value : 2048},
        {label : '4096', value : 4096},
      ],
      value: 2048,
      required: true,
      validation: helptext_system_certificates.add.key_length.validation,
      isHidden: false,
      relation : [
        {
          action : 'ENABLE',
          when : [ {
            name : 'key_type',
            value : 'RSA',
          } ]
        },
      ]
    },
    {
      type : 'select',
      name : 'digest_algorithm',
      placeholder : helptext_system_certificates.add.digest_algorithm.placeholder,
      tooltip: helptext_system_certificates.add.digest_algorithm.tooltip,
      options : [
        {label : 'SHA1', value : 'SHA1'},
        {label : 'SHA224', value : 'SHA224'},
        {label : 'SHA256', value : 'SHA256'},
        {label : 'SHA384', value : 'SHA384'},
        {label : 'SHA512', value : 'SHA512'},
      ],
      value: 'SHA256',
      required: true,
      validation: helptext_system_certificates.add.digest_algorithm.validation,
      isHidden: false,
    },
    {
      type : 'input',
      name : 'lifetime',
      placeholder : helptext_system_certificates.add.lifetime.placeholder,
      tooltip: helptext_system_certificates.add.lifetime.tooltip,
      inputType: 'number',
      required: true,
      value: 3650,
      validation: helptext_system_certificates.add.lifetime.validation,
      isHidden: false,
    },
    {
      type : 'select',
      name : 'country',
      placeholder : helptext_system_certificates.add.country.placeholder,
      tooltip: helptext_system_certificates.add.country.tooltip,
      options : [
      ],
      value: 'US',
      required: true,
      validation: helptext_system_certificates.add.country.validation,
      isHidden: false,
    },
    {
      type : 'input',
      name : 'state',
      placeholder : helptext_system_certificates.add.state.placeholder,
      tooltip: helptext_system_certificates.add.state.tooltip,
      required: true,
      validation: helptext_system_certificates.add.state.validation,
      isHidden: false,
    },
    {
      type : 'input',
      name : 'city',
      placeholder : helptext_system_certificates.add.city.placeholder,
      tooltip: helptext_system_certificates.add.city.tooltip,
      required: true,
      validation: helptext_system_certificates.add.city.validation,
      isHidden: false,
    },
    {
      type : 'input',
      name : 'organization',
      placeholder : helptext_system_certificates.add.organization.placeholder,
      tooltip: helptext_system_certificates.add.organization.tooltip,
      required: true,
      validation: helptext_system_certificates.add.organization.validation,
      isHidden: false,
    },
    {
      type : 'input',
      name : 'organizational_unit',
      placeholder : helptext_system_certificates.add.organizational_unit.placeholder,
      tooltip: helptext_system_certificates.add.organizational_unit.tooltip,
      required: false,
      isHidden: false,
    },
    {
      type : 'input',
      name : 'email',
      placeholder : helptext_system_certificates.add.email.placeholder,
      tooltip: helptext_system_certificates.add.email.tooltip,
      required: true,
      validation : helptext_system_certificates.add.email.validation,
      isHidden: false,
    },
    {
      type : 'input',
      name : 'common',
      placeholder : helptext_system_certificates.add.common.placeholder,
      tooltip: helptext_system_certificates.add.common.tooltip,
      required: true,
      validation : helptext_system_certificates.add.common.validation,
      isHidden: false,
    },
    {
      type : 'textarea',
      name : 'san',
      placeholder: helptext_system_certificates.add.san.placeholder,
      tooltip: helptext_system_certificates.add.san.tooltip,
      isHidden: false,
    },
    {
      type : 'textarea',
      name : 'certificate',
      placeholder : helptext_system_certificates.add.certificate.placeholder,
      tooltip : helptext_system_certificates.add.certificate.tooltip,
      required: true,
      validation : helptext_system_certificates.add.certificate.validation,
      isHidden: true,
    },
    {
      type : 'textarea',
      name : 'CSR',
      placeholder : helptext_system_certificates.add.cert_csr.placeholder,
      tooltip : helptext_system_certificates.add.cert_csr.tooltip,
      required: true,
      validation : helptext_system_certificates.add.cert_csr.validation,
      isHidden: true,
    },
    {
      type : 'textarea',
      name : 'privatekey',
      placeholder : helptext_system_certificates.add.privatekey.placeholder,
      tooltip : helptext_system_certificates.add.privatekey.tooltip,
      isHidden: true,
      relation : [
        {
          action : 'DISABLE',
          when : [ {
            name : 'csronsys',
            value : true,
          } ]
        },
      ]
    },
    {
      type : 'input',
      name : 'passphrase',
      placeholder : helptext_system_certificates.add.passphrase.placeholder,
      tooltip : helptext_system_certificates.add.passphrase.tooltip,
      inputType : 'password',
      validation : helptext_system_certificates.add.passphrase.validation,
      isHidden: true,
      togglePw : true,
      relation : [
        {
          action : 'DISABLE',
          when : [ {
            name : 'csronsys',
            value : true,
          } ]
        },
      ]
    },
    {
      type : 'input',
      name : 'passphrase2',
      inputType : 'password',
      placeholder : helptext_system_certificates.add.passphrase2.placeholder,
      isHidden : true,
      relation : [
        {
          action : 'DISABLE',
          when : [ {
            name : 'csronsys',
            value : true,
          } ]
        },
      ]
    }
  ];

  private internalFields: Array<any> = [
    'signedby',
    'key_type',
    'ec_curve',
    'key_length',
    'digest_algorithm',
    'lifetime',
    'country',
    'state',
    'city',
    'organization',
    'organizational_unit',
    'email',
    'common',
    'san',
  ];
  private csrFields: Array<any> = [
    'key_type',
    'key_length',
    'ec_curve',
    'digest_algorithm',
    'country',
    'state',
    'city',
    'organization',
    'organizational_unit',
    'email',
    'common',
    'san',
  ];
  private importFields: Array<any> = [
    'certificate',
    'csronsys',
    'csrlist',
    'privatekey',
    'passphrase',
    'passphrase2'
  ];
  private importCSRFields: Array<any> = [
    'CSR',
    'privatekey',
    'passphrase',
    'passphrase2'
  ];

  private country: any;
  private signedby: any;
  private csrlist: any;
  public identifier: any;

  constructor(protected router: Router, protected route: ActivatedRoute,
              protected rest: RestService, protected ws: WebSocketService, protected dialog: MatDialog,
              protected systemGeneralService: SystemGeneralService) {}

  preInit() {
    this.systemGeneralService.getUnsignedCAs().subscribe((res) => {
      this.signedby = _.find(this.fieldConfig, {'name' : 'signedby'});
      res.forEach((item) => {
        this.signedby.options.push(
            {label : item.name, value : item.id});
      });
    });

    this.systemGeneralService.getCertificateCountryChoices().subscribe((res) => {
      this.country = _.find(this.fieldConfig, {'name' : 'country'});
      for (const item in res) {
        this.country.options.push(
          { label : res[item], value : item}
        );
      };
    });

    this.ws.call('certificate.query').subscribe((res) => {
      this.csrlist = _.find(this.fieldConfig, {'name' : 'csrlist'});
      res.forEach((item) => {
        if (item.CSR !== null) {
          this.CSRList.push(item);
          this.csrlist.options.push(
            {label: item.name, value: item.id}
          )
        }
      })
    })
  }

  afterInit(entity: any) {
    this.entityForm = entity;
    for (let i in this.csrFields) {
      this.hideField(this.csrFields[i], true, entity);
    }
    for (let i in this.importFields) {
      this.hideField(this.importFields[i], true, entity);
    }
    for (let i in this.importCSRFields) {
      this.hideField(this.importCSRFields[i], true, entity);
    }
    for (let i in this.internalFields) {
      this.hideField(this.internalFields[i], false, entity);
    }
    this.hideField(this.internalFields[2], true, entity)

    entity.formGroup.controls['create_type'].valueChanges.subscribe((res) => {
      if (res == 'CERTIFICATE_CREATE_INTERNAL') {
        for (let i in this.csrFields) {
          this.hideField(this.csrFields[i], true, entity);
        }
        for (let i in this.importFields) {
          this.hideField(this.importFields[i], true, entity);
        }
        for (let i in this.importCSRFields) {
          this.hideField(this.importCSRFields[i], true, entity);
        }
        for (let i in this.internalFields) {
          this.hideField(this.internalFields[i], false, entity);
        }

        // This block makes the form reset its 'disabled/hidden' settings on switch of type
        if (entity.formGroup.controls['key_type'].value === 'RSA') {
          entity.setDisabled('ec_curve', true);
        } else if (entity.formGroup.controls['key_type'].value === 'EC') {
          entity.setDisabled('key_length', true);
        } 

      } else if (res == 'CERTIFICATE_CREATE_CSR') {
        for (let i in this.internalFields) {
          this.hideField(this.internalFields[i], true, entity);
        }
        for (let i in this.importFields) {
          this.hideField(this.importFields[i], true, entity);
        }
        for (let i in this.importCSRFields) {
          this.hideField(this.importCSRFields[i], true, entity);
        }
        for (let i in this.csrFields) {
          this.hideField(this.csrFields[i], false, entity);
        }

        // This block makes the form reset its 'disabled/hidden' settings on switch of type
        if (entity.formGroup.controls['key_type'].value === 'RSA') {
          entity.setDisabled('ec_curve', true);
        } else if (entity.formGroup.controls['key_type'].value === 'EC') {
          entity.setDisabled('key_length', true);
        }

      } else if (res == 'CERTIFICATE_CREATE_IMPORTED') {
        for (let i in this.internalFields) {
          this.hideField(this.internalFields[i], true, entity);
        }
        for (let i in this.csrFields) {
          this.hideField(this.csrFields[i], true, entity);
        }
        for (let i in this.importCSRFields) {
          this.hideField(this.importCSRFields[i], true, entity);
        }
        for (let i in this.importFields) {
          this.hideField(this.importFields[i], false, entity);
        }

        // This block makes the form reset its 'disabled/hidden' settings on switch of type
        if (!entity.formGroup.controls['csronsys'].value) {
          entity.setDisabled('csrlist', true);
        } else {
          entity.setDisabled('privatekey', true);
          entity.setDisabled('passphrase', true);
          entity.setDisabled('passphrase2', true);
        }

      } else if (res == 'CERTIFICATE_CREATE_IMPORTED_CSR') {
        for (let i in this.internalFields) {
          this.hideField(this.internalFields[i], true, entity);
        }
        for (let i in this.csrFields) {
          this.hideField(this.csrFields[i], true, entity);
        }
        for (let i in this.importFields) {
          this.hideField(this.importFields[i], true, entity);
        }
        for (let i in this.importCSRFields) {
          this.hideField(this.importCSRFields[i], false, entity);
        }
      }
    })

    entity.formGroup.controls['name'].valueChanges.subscribe((res) => {
      this.identifier = res;
    })
  
    entity.formGroup.controls['name'].statusChanges.subscribe((res) => {
      if (this.identifier && res === 'INVALID') {
        _.find(this.fieldConfig)['hasErrors'] = true;
      } else {
        _.find(this.fieldConfig)['hasErrors'] = false;
      }
    })
  }

  hideField(fieldName: any, show: boolean, entity: any) {
    let target = _.find(this.fieldConfig, {'name' : fieldName});
    target['isHidden'] = show;
    entity.setDisabled(fieldName, show, show);
  }

  beforeSubmit(data: any) {
    if (data.create_type === 'CERTIFICATE_CREATE_INTERNAL' || 
      data.create_type === 'CERTIFICATE_CREATE_CSR') {
        if (data.san == undefined || data.san == '') {
          data.san = [];
        } else {
          data.san = _.split(data.san, /\s/);
        }
    }

    if (data.csronsys) {
      this.CSRList.forEach((item) => {
        if (item.id === data.csrlist) {
          data.privatekey = item.privatekey;
          data.passphrase = item.passphrase;
          data.passphrase2 = item.passphrase2;
          return;
        }
      })
    }
    delete data.csronsys;
    delete data.csrlist;

    // Addresses non-pristine field being mistaken for a passphrase of ''
    if (data.passphrase == '') {
      data.passphrase = undefined;
    }

    if (data.passphrase2) {
      delete data.passphrase2;
    }
  }

  customSubmit(payload){
    this.dialogRef = this.dialog.open(EntityJobComponent, { data: { "title": "" }});
    this.dialogRef.componentInstance.setDescription(("Working..."));
    this.dialogRef.componentInstance.setCall(this.addCall, [payload]);
    this.dialogRef.componentInstance.submit();
    this.dialogRef.componentInstance.success.subscribe((res) => {
      this.dialog.closeAll();
      this.router.navigate(new Array('/').concat(this.route_success));
    });
    this.dialogRef.componentInstance.failure.subscribe((res) => {
      this.dialogRef.close();
      new EntityUtils().handleWSError(this.entityForm, res);
    });

  }


}
