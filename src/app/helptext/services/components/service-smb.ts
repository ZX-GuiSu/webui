import { T } from '../../../translate-marker';
import { Validators } from '@angular/forms';
import { regexValidator } from '../../../pages/common/entity/entity-form/validators/regex-validation';
import globalHelptext from '../../../helptext/global-helptext';

export default {
cifs_srv_fieldset_netbios: T('NetBIOS'),
cifs_srv_fieldset_idmap: T('IDMAP'),
cifs_srv_fieldset_other: T('Other Options'),

cifs_srv_netbiosname_placeholder: T('NetBIOS Name'),
cifs_srv_netbiosname_tooltip: T('Automatically populated with the original hostname\
 of the system. This name is limited to 15 characters and\
 cannot be the <b>Workgroup</b> name.'),
cifs_srv_netbiosname_validation : [ Validators.required, Validators.maxLength(15) ],

cifs_srv_netbiosname_b_placeholder: T(`NetBIOS Name (${globalHelptext.Ctrlr} 2)`),
cifs_srv_netbiosname_b_tooltip: T('Automatically populated with the original hostname\
 of the system. This name is limited to 15 characters and\
 cannot be the <b>Workgroup</b> name.'),
cifs_srv_netbiosname_b_validation : [ Validators.required, Validators.maxLength(15) ],

cifs_srv_netbiosalias_placeholder: T('NetBIOS Alias'),
cifs_srv_netbiosalias_tooltip: T('Enter any aliases, separated by spaces.\
 Each alias can be up to 15 characters long.'),
cifs_srv_netbiosalias_validation: [ Validators.maxLength(15) ],

cifs_srv_workgroup_placeholder: T('Workgroup'),
cifs_srv_workgroup_tooltip: T('Must match Windows workgroup\
 name. This setting is ignored if the\
 <a href="--docurl--/directoryservices.html#active-directory"\
 target="_blank">Active Directory</a> or <a\
 href="--docurl--/directoryservices.html#ldap"\
 target="_blank">LDAP</a> service is running.'),
cifs_srv_workgroup_validation : [ Validators.required ],

cifs_srv_description_placeholder: T('Description'),
cifs_srv_description_tooltip: T('Optional. Enter a server description.'),

cifs_srv_unixcharset_placeholder: T('UNIX Charset'),
cifs_srv_unixcharset_tooltip: T('Default is UTF-8 which supports all characters in\
 all languages.'),

cifs_srv_loglevel_placeholder: T('Log Level'),
cifs_srv_loglevel_tooltip: T('Choices are <i>Minimum, Normal, or Debug</i>.'),
cifs_srv_loglevel_options: [
  { label: 'None', value: 'NONE' },
  { label: 'Minimum', value: 'MINIMUM' },
  { label: 'Normal', value: 'NORMAL' },
  { label: 'Full', value: 'FULL' },
  { label: 'Debug', value: 'DEBUG' },
],

cifs_srv_syslog_placeholder: T('Use syslog only'),
cifs_srv_syslog_tooltip: T('Set to log authentication failures in <i>/var/log/messages</i>\
 instead of the default of <i>/var/log/samba4/log.smbd</i>.'),

cifs_srv_localmaster_placeholder: T('Local Master'),
cifs_srv_localmaster_tooltip: T('Set to determine if the system participates in\
 a browser election. Leave unset when the network contains an AD\
 or LDAP server, or when Vista or Windows 7 machines\
 are present.'),

cifs_srv_aapl_extensions_placeholder: T('Enable Apple SMB2/3 Protocol Extensions'),
cifs_srv_aapl_extensions_tooltip: T('Enable Apple SMB2/3 Protocol Extensions. This is required for Time Machine support.'),

cifs_srv_guest_placeholder: T('Guest Account'),
cifs_srv_guest_tooltip: T('Account to be used for guest access. Default is\
 nobody. Account is required to have permissions to\
 the shared pool or dataset.\
 When the Guest Account user is deleted it resets to nobody.'),

cifs_srv_admin_group_placeholder: T('Administrators Group'),
cifs_srv_admin_group_tooltip: T('Members of this group are local admins\
 and automatically have privileges to take ownership of any file in an SMB\
 share, reset permissions, and administer the SMB server through the\
 Computer Management MMC snap-in.'),
 cifs_srv_admin_group_validation : [ Validators.maxLength(120) ],

cifs_srv_smb_options_placeholder: T('Auxiliary Parameters'),
cifs_srv_smb_options_tooltip: T('Enter additional <b>smb.conf</b> options. See the <a href="http://www.oreilly.com/openbook/samba/book/appb_02.html"\
 target="_blank">Samba Guide</a>\
 for more information on these settings.'),

cifs_srv_ntlmv1_auth_placeholder: T('NTLMv1 Auth'),
cifs_srv_ntlmv1_auth_tooltip: T('Off by default. When set,\
 <a href="https://www.freebsd.org/cgi/man.cgi?query=smbd" target="_blank">smbd(8)</a>\
 attempts to authenticate users with the insecure\
 and vulnerable NTLMv1 encryption. This setting allows\
 backward compatibility with older versions of Windows,\
 but is not recommended and should not be used on\
 untrusted networks.'),

cifs_srv_bindip_placeholder: T('Bind IP Addresses'),
cifs_srv_bindip_tooltip: T('Select the IP addresses SMB will listen for.'),

idmap_tdb_range_low_placeholder: T('Range Low'),
idmap_tdb_range_low_tooltip: T('The beginning UID/GID for which this system is\
 authoritative. Any UID/GID lower than this value is ignored.\
 This avoids accidental UID/GID overlaps between local and remotely\
 defined IDs.'),
 idmap_tdb_range_low_validation: [regexValidator(/^\d+$/)],

idmap_tdb_range_high_placeholder: T('Range High'),
idmap_tdb_range_high_tooltip: T('The ending UID/GID for which this system is authoritative.\
 Any UID/GID higher than this value is ignored.\
 This avoids accidental UID/GID overlaps between local\
 and remotely defined IDs.'),


cifs_srv_enable_smb1_placeholder: T('Enable SMB1 support'),
cifs_srv_enable_smb1_tooltip: T('Use this option to allow legacy SMB clients to connect to the\
 server. Note that SMB1 is being deprecated and it is advised\
 to upgrade clients to operating system versions that support\
 modern versions of the SMB protocol.')
}
