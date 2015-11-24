var exec = require('child_process').exec;
var Table = require('cli-table');

var table = new Table({
  head: ['Name', 'ID', 'Type', 'State', 'IP', 'Key Name', 'LuanchTime'],
  chars: { 'top': '═' , 'top-mid': '╤' , 'top-left': '╔' , 'top-right': '╗'
         , 'bottom': '═' , 'bottom-mid': '╧' , 'bottom-left': '╚' , 'bottom-right': '╝'
         , 'left': '║' , 'left-mid': '╟' , 'mid': '─' , 'mid-mid': '┼'
         , 'right': '║' , 'right-mid': '╢' , 'middle': '│' }
});


console.log('grabbing instances...');

function addRow(element){
  var name = element.Instances[0].Tags[0].Value;
  var id = element.Instances[0].InstanceId;
  var type = element.Instances[0].InstanceType;
  var state = element.Instances[0].State.Name;
  var ip = element.Instances[0].PublicIpAddress;
  var keyname = element.Instances[0].KeyName;
  var launched = element.Instances[0].LaunchTime;
  table.push(
    [name, id, type, state, ip, keyname, launched]
  );
}

function formatInstances(element, index, array) {
  if(element.Instances[0].State.Name == 'running'){
    addRow(element);
  }
}

function showInstances(error, stdout, stderr) {
  instances = JSON.parse(stdout);
  instances.Reservations.forEach(formatInstances);
  console.log(table.toString());
}

exec("aws ec2 describe-instances",showInstances);
