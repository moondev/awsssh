#! /usr/bin/env node
"use strict";
var AWS = require('aws-sdk');
var inquirer = require("inquirer");
var Spinner = require('cli-spinner').Spinner;
var spawn = require('child_process').spawn;

var reservations = [];
var instances = [];
var spinner = new Spinner('Loading Instances');

function findName(tags){
  var name = false;
  for(var i=0;i<tags.length;i++){
    if(tags[i].Key == "Name"){
      name = tags[i].Value;
    }
  }
  return name;
}

function formatInstances(element, index, array) {
  var instance = element.Instances[0];
  if(instance.State.Name == 'running' && findName(instance.Tags)){
    instances.push([
      instance.InstanceId,
      instance.PublicIpAddress,
      instance.KeyName,
      findName(instance.Tags),
    ].join("\t"));
  }
}

function listInstances(error, data) {
  spinner.stop(true);
  reservations = data.Reservations;
  data.Reservations.forEach(formatInstances);
  inquirer.prompt([
    {
      type: "list",
      name: "instance",
      message: "Select instance",
      choices: instances
    },
    {
      type: "list",
      name: "ssh",
      message: "SSH connection method",
      choices: ['normal','iTerm2 tmux']
    }
  ], function(answers) {
      var instance = answers.instance.split("\t");
      var params = ['-i',process.env.HOME + '/.ssh/' + instance[2] + '.pem',"ubuntu@" + instance[1]];
      if (answers.ssh == 'iTerm2 tmux'){
        params.push('-t');
        params.push('tmux -CC');
      }
      spawn("ssh", params, { stdio: 'inherit' });
    });
}

function loadInstances(){
  spinner.start();
  new AWS.EC2().describeInstances(listInstances);
}

inquirer.prompt([{
  type: "list",
  name: "region",
  message: "Select region",
  choices: ['us-east-1','us-west-1','us-west-2']
}], function(ans) {
  AWS.config.update({region: ans.region});
  loadInstances();
});
