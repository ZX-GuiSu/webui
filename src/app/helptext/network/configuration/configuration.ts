import { T } from '../../../translate-marker';
import globalHelptext from '../../../helptext/global-helptext';

export default {

hostname_placeholder : T('Hostname'),
hostname_tooltip : T('System hostname.'),

hostname_b_placeholder : T(`Hostname (${globalHelptext.Ctrlr} 2)`),
hostname_b_tooltip : T(''),

hostname_virtual_placeholder : T('Hostname (Virtual)'),
hostname_virtual_tooltip : T(''),

domain_placeholder : T('Domain'),
domain_tooltip : T('System domain name, like <i>example.com</i>'),

domains_placeholder: T('Additional Domains'),
domains_tooltip : T('Additional space-delimited domains to search.\
 Adding search domains can cause slow DNS lookups.'),

ipv4gateway_placeholder : T('IPv4 Default Gateway'),
ipv4gateway_tooltip : T('Enter an IPv4 address. This overrides the default\
 gateway provided by DHCP.'),

ipv6gateway_placeholder : T('IPv6 Default Gateway'),
ipv6gateway_tooltip : T('Enter an IPv6 address. This overrides the default\
 gateway provided by DHCP.'),

nameserver1_placeholder : T('Nameserver 1'),
nameserver1_tooltip : T('Primary DNS server.'),

nameserver2_placeholder : T('Nameserver 2'),
nameserver2_tooltip : T('Secondary DNS server.'),

nameserver3_placeholder : T('Nameserver 3'),
nameserver3_tooltip : T('Third DNS server.'),

httpproxy_placeholder : T('HTTP Proxy'),
httpproxy_tooltip : T('Enter network proxy information if a proxy is used. Example:\
 <i>http://my.proxy.server:3128</i> or\
 <i>http://user:password@my.proxy.server:3128</i>'),

netwait_enabled_placeholder : T('Enable netwait feature'),
netwait_enabled_tooltip : T('Set to delay the start of network services\
 until pings are returned from the IP addresses in the <i>netwait\
 IP list</i>.'),
netwait_ip_placeholder : T('Netwait IP list'),
netwait_ip_tooltip : T('Enter a space-delimited list of IP addresses to <a\
 href="https://www.freebsd.org/cgi/man.cgi?query=ping"\
 target="_blank">ping(8)</a>. Each address is tried\
 until one is successful or the list is exhausted.\
 Leave empty to use the default gateway.'),

hosts_placeholder : T('Host name database'),
hosts_tooltip : T('Additional hosts to be appended to <i>/etc/hosts</i>.\
 Each host entry is a single line\
 with whitespace-delimited IP address, hostname, and\
 any aliases. Hosts defined here are still accessible\
 by name even when DNS is not available. See <a\
 href="https://www.freebsd.org/cgi/man.cgi?query=hosts"\
 target="_blank">hosts(5)</a> for additional information.'),

hostname_and_domain: T('Hostname and Domain'),
gateway: T('Default Gateway'),
nameservers: T('DNS Servers'),
other: T('Other Settings'),
service_announcement: T('Service Announcement'),

netbios_placeholder: T('NetBIOS-NS'),
netbios_tooltip: T('Legacy NetBIOS name server. Advertises the SMB \
 Service <i>NetBIOS Name</i>. Could be required for legacy SMB1 clients \
 to discover the server (server appears in <i>Network Neighborhood</i>).'),
mdns_placeholder: T('mDNS'),
mdns_tooltip: T('Multicast DNS. Uses the system <i>Hostname</i> to \
 advertise enabled and running services. For example, this controls if \
 the server appears under <i>Network</i> on MacOS clients.'),
wsd_placeholder: T('WS-Discovery'),
wsd_tooltip: T('Uses the SMB Service <i>NetBIOS Name</i> to advertise \
 the server to WS-Discovery clients. This causes the computer appear in \
 the <i>Network Neighborhood</i> of modern Windows OSes.'),
}
