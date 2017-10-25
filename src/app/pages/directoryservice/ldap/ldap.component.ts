import {ApplicationRef, Component, Injector, OnInit} from '@angular/core';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import * as _ from 'lodash';
import {Subscription} from 'rxjs';

import {
  RestService,
  SystemGeneralService,
  WebSocketService
} from '../../../services/';
import {
  FieldConfig
} from '../../common/entity/entity-form/models/field-config.interface';

@Component({
  selector : 'ldap',
  template : `<entity-form [conf]="this"></entity-form>`,
})

export class LdapComponent {
  protected resource_name: string = 'directoryservice/ldap';
  protected isBasicMode: boolean = true;

  public fieldConfig: FieldConfig[] = [
    {
      type : 'input', 
      name : 'ldap_hostname', 
      placeholder : 'Hostname'
    },
    {
      type : 'input', 
      name : 'ldap_basedn', 
      placeholder : 'Base DN'
    },
    {
      type : 'input', 
      name : 'ldap_binddn', 
      placeholder : 'Bind DN'
    },

    {
      type : 'input',
      name : 'ldap_bindpw',
      placeholder : 'Bind Password',
      inputType : 'password',
    },
    {
      type : 'checkbox',
      name : 'ldap_anonbind',
      placeholder : 'Allow Anonymous Binding',
    },
    {
      type : 'input', 
      name : 'ldap_usersuffix', 
      placeholder : 'User Suffix'
    },
    {
      type : 'input', 
      name : 'ldap_groupsuffix', 
      placeholder : 'Group Suffix'
    },
    {
      type : 'input',
      name : 'ldap_passwordsuffix',
      placeholder : 'Password Suffix'
    },
    {
      type : 'input', 
      name : 'ldap_machinesuffix', 
      placeholder : 'Machine Suffix'
    },
    {
      type : 'input', 
      name : 'ldap_sudosuffix', 
      placeholder : 'SUDO Suffix'
    },
    {
      type : 'select',
      name : 'ldap_kerberos_realm',
      placeholder : 'Kerberos Realm',
      options : []
    },
    {
      type : 'select',
      name : 'ldap_kerberos_principal',
      placeholder : 'Kerberos Principal',
      options : []
    },
    {
      type : 'select',
      name : 'ldap_ssl',
      placeholder : 'Encryption Mode',
      options : [
        {label : 'Off', value : 'off'}, {label : 'SSL', value : 'on'},
        {label : 'TLS', value : 'start_tls'}
      ]
    },
    {
      type : 'select',
      name : 'ldap_certificate',
      placeholder : 'Certificate',
      options : []
    },
    {
      type : 'input', 
      name : 'ldap_timeout', 
      placeholder : 'LDAP timeout'
    },
    {
      type : 'input', 
      name : 'ldap_dns_timeout', 
      placeholder : 'DNS timeout'
    },
    {
      type : 'select',
      name : 'ldap_idmap_backend',
      placeholder : 'Idmap Backend',
      options : []
    },
    {
      type : 'textarea',
      name : 'ldap_auxiliary_parameters',
      placeholder : 'Auxiliary Parameters'
    },
    {
      type : 'select',
      name : 'ldap_schema',
      placeholder : 'Schema',
      options : []
    },
    {
      type : 'input',
      name : 'ldap_netbiosname_a',
      placeholder : 'Netbios Name',
    },
    {
      type : 'input',
      name : 'ldap_netbiosalias',
      placeholder : 'NetBIOS alias',
    },
    {
      type : 'checkbox',
      name : 'ldap_has_samba_schema',
      placeholder : 'Samba Schema',
    },
    {
      type : 'checkbox',
      name : 'ldap_enable',
      placeholder : 'Enable',
    },
  ];

  protected advanced_field: Array<any> = [
    'ldap_anonbind',
    'ldap_usersuffix',
    'ldap_groupsuffix',
    'ldap_passwordsuffix',
    'ldap_machinesuffix', 
    'ldap_sudosuffix', 
    'ldap_kerberos_realm', 
    'ldap_kerberos_principal',
    'ldap_ssl',
    'ldap_certificate',
    'ldap_timeout', 
    'ldap_dns_timeout', 
    'ldap_idmap_backend', 
    'ldap_auxiliary_parameters', 
    'ldap_schema', 
    'ldap_netbiosalias',        
    'ldap_netbiosname_a',
    'ldap_has_samba_schema'
  ];

  isCustActionVisible(actionId: string) {
    if (actionId === 'advanced_mode' && this.isBasicMode === false) {
      return false;
    } else if (actionId === 'basic_mode' && this.isBasicMode === true) {
      return false;
    }
    return true;
  }

  public custActions: Array<any> = [
    {
      id : 'basic_mode',
      name : 'Basic Mode',
      function : () => { this.isBasicMode = !this.isBasicMode; }
    },
    {
      'id' : 'advanced_mode',
      name : 'Advanced Mode',
      function : () => { this.isBasicMode = !this.isBasicMode; }
    }
  ];
  
  protected ldap_kerberos_realm: any;
  protected ldap_kerberos_principal: any;
  protected ldap_ssl: any;
  protected ldapCertificate: any;
  protected ldap_idmap_backend: any;
  protected ldap_schema: any;

  constructor(protected router: Router, protected route: ActivatedRoute,
              protected rest: RestService, protected ws: WebSocketService,
              protected _injector: Injector, protected _appRef: ApplicationRef,
              protected systemGeneralService: SystemGeneralService) {}

  afterInit(entityEdit: any) {
    this.systemGeneralService.getCA().subscribe((res) => {
      this.ldapCertificate =
          _.find(this.fieldConfig, {name : 'ldap_certificate'});
      res.forEach((item) => {
        this.ldapCertificate.options.push(
            {label : item.cert_name, value : item.id});
      });
    });



  }
}
