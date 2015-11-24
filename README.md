# awsssh

##Simple command-line utility to list and ssh into EC2 instances.

If you do not have the aws-cli package installed, create a credentials file at `~/.aws/credentials`

```
[default]
aws_access_key_id = your_access_key
aws_secret_access_key = your_secret_key
```

Ensure that your keys are in ~/.ssh

The default username is `ubuntu`. To connect with a different username, ad a `username` tag to your instance.

Simply `$ awsssh` to select you region, instance and ssh method.
