/* eslint-disable global-require,import/no-dynamic-require,no-console,no-restricted-globals */

const fs = require('fs');
const path = require('path');


const configFilePath = path.resolve(__dirname, '../config/config.json');
const configTemplateFilePath = path.resolve(__dirname, '../config/config-template.json');


class Config {
	constructor() {
		try {
			this.config = require(configFilePath);
		} catch (error) {
			console.error(error);
			this.config = {};
		}

		this.syncConfigFileWithTemplate();
	}


	/**
	 * Method syncs fieldsets and properties in current config with fieldsets
	 * and properties from ./config-template.json
	 * If some fieldset or property is missing in current config, it will be
	 * inserted into current config to the right position. Other properties
	 * will not be changed
	 */
	syncConfigFileWithTemplate() {
		const { config } = this;
		const configTemplate = require(configTemplateFilePath);

		configTemplate.forEach((fieldSet, fieldSetIndex) => {
			const fieldSetId = fieldSet.id;

			// Find this fieldset in current config
			const configFieldSet = config.filter(configFieldSet => configFieldSet.id === fieldSetId)[0];

			if (configFieldSet) {
				// Fieldset exists in config, check its properties
				(fieldSet.properties || []).forEach((property, propertyIndex) => {
					const propertyId = property.id;

					if (! configFieldSet.properties) {
						configFieldSet.properties = [];
					}

					const configProperty = configFieldSet.properties
						.filter(configProp => configProp.id === propertyId)[0];

					if (! configProperty) {
						configFieldSet.properties.splice(propertyIndex, 0, property);
					}
				});
			} else {
				// It is a new fieldset, insert it into config
				config.splice(fieldSetIndex, 0, fieldSet);
			}
		});

		this.updateConfigFile();
	}


	getConfig() {
		return this.config;
	}


	/**
	 * Private method which finds property by its ID.
	 * ID may be compound, e.g. parentID.childID
	 * @param id {String} id of property that method should return
	 * @returns {*}
	 */
	findPropertyObjectById(id) {
		const [fieldSetId, propertyId] = id.split('.');

		const fieldSet = this.config.filter(item => item.id === fieldSetId)[0];

		if (! fieldSet) {
			return null;
		}

		return (fieldSet.properties || [])
			.filter(item => item.id === propertyId)[0];
	}


	updateConfig(newConfig) {
		this.prepareConfig(newConfig);
		this.config = newConfig;
		this.updateConfigFile();
	}


	get(key) {
		const property = this.findPropertyObjectById(key);
		return property ? property.value : null;
	}


	set(key, value) {
		const property = this.findPropertyObjectById(key);

		if (property) {
			property.value = value;
		}
	}


	updateFiles() {
		this.updateConfigFile();
	}


	/**
	 * Preprocessors of config object
	 * @param config
	 */
	prepareConfig(config) {
		config.forEach((fieldSet) => {
			const properties = fieldSet.properties || [];

			// Prepare numeric properties
			properties
				.filter(property => property.format === 'Number')
				.forEach((property) => {
					try {
						// Trying to parse string to number
						property.value = parseInt(property.value, 10);

						// If parsing failed, reset value to default
						if (property.value < 0 || isNaN(property.value)) {
							property.value = 0;
						}
					} catch (error) {
						// If parsing failed, reset value to default
						property.value = 0;
					}
				});
		});
	}


	/**
	 * Updates config.json file, writes new version of config JSON
	 */
	updateConfigFile() {
		const { config } = this;

		try {
			fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
		} catch (error) {
			console.error(error);
		}
	}
}


const config = new Config();
module.exports = config;
