# IoT Command & Control plugin for Grafana and Bosch IoT Suite

# Features
 * Sending command and control messages to your digital Twin
 * Credentials storage
 * Connection test
 * Message delivery status


# Build plugin

```
npm install
npm run build
```

# Use in Grafana

In order to use the plugin in Grafana go through the building steps first. 
Next place the dist folder into ```/var/lib/grafana/plugins``` or in the docker-compose's
specified volume directory.

Restart your Grafana instance.

## Credits

Made by Adrian Gruszczynski
