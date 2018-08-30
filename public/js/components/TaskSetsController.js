/* eslint-disable no-underscore-dangle */

window.TaskSetsController = {
	template: `
		<div>
		  <div v-if="!selectedTaskSet">
			<div class="form-group">
			  <button @click.prevent="addTaskSet()" type="button" class="btn btn-primary">
				{{signs.add_taskset}}
			  </button>
			</div>
		
			<div class="row">
			  <table class="table table-striped">
				<thead>
				<tr>
				  <th>№</th>
				  <th>{{signs.assessment_limit_short}}</th>
				  <th>{{signs.random_selection}}</th>
				  <th>{{signs['config_props.cliExport_datasets']}}</th>
				  <th>{{signs.active_taskset}}</th>
				  <th>{{signs.description}}</th>
				  <th>{{signs.actions}}</th>
				</tr>
				</thead>
				<tbody>
				<tr v-for="(taskSet, index) in taskSets">
				  <td>{{index + 1}}</td>
				  <td>{{taskSet.assessmentLimit}}</td>
				  <td>{{booleanToReadableString(taskSet.randomSelection)}}</td>
				  <td>{{'dataset1, dataset2, dataset3'}}</td>
				  <td>{{booleanToReadableString(taskSet.isActive)}}</td>
				  <td>{{taskSet.description || '-'}}</td>
				  <td>
					<button @click.prevent="editTaskSet(taskSet)" type="button" class="btn btn-success btn-xs">
					  {{signs.edit}}
					</button>
		
					<button @click.prevent="1" type="button" class="btn btn-primary btn-xs">
					  {{signs.activate}}
					</button>
				  </td>
				</tr>
				</tbody>
			  </table>
			</div>
		  </div>
		
			{{selectedTaskSet && selectedTaskSet.dataSets}}
		
		  <div class="users-form-wrapper" v-if="selectedTaskSet">
			<h1 v-if="selectedTaskSet._id">{{signs.edit_taskset}}</h1>
			<h1 v-else>{{signs.add_taskset}}</h1>
		
			<button class="btn btn-success" @click.prevent="closeForm()">{{signs.cancel}}</button>
			<button class="btn btn-primary" @click.prevent="submitForm()">{{signs.submit}}</button>
		
			<div class="row tasksets-form">
			  <div class="col-xs-6">
				<div autocomplete="off">
		
				  <div class="form-group property">
					<label for="limit">{{signs['config_props.assessment_limit']}}</label>
					<input :disabled="!selectedTaskSet.randomSelection" type="number" id="limit" class="form-control" v-model="selectedTaskSet.assessmentLimit">
				  </div>
		
				  <div class="form-check-label property">
					<input
					  id="randomSelection"
					  class="form-check-input"
					  type="checkbox"
					  v-model="selectedTaskSet.randomSelection"
					>
		
					<label for="randomSelection">{{signs['config_props.show_randomly']}}</label>
				  </div>
				  
				  <div class="form-check-label property">
					<label for="task-set-description">{{signs.description}}</label>
					
					<textarea
					  id="task-set-description"
					  class="form-check-input"
					  type="checkbox"
					  v-model="selectedTaskSet.description"
					></textarea>
				  </div>
		
				  <h5>
				  	{{this.signs.datasets_for_task}}
				  	
				    <i @click="setDataSetsStatus(true)" :title="signs.check_all" class="fa fa-check-square-o datasets-control" aria-hidden="true"></i>
					<i @click="setDataSetsStatus(false)" :title="signs.uncheck_all" class="fa fa-square-o datasets-control" aria-hidden="true"></i>
				  </h5>
				  
				  <div v-if="dataSetsList.length" class="datasets-container property">
					<div class="form-check-label dataset-item" v-for="(dataset, index) in selectedTaskSet.dataSets">
					  <input
						:id="index"
						class="form-check-input"
						type="checkbox"
						v-model="dataset.isInTaskSet"
					  >
		
					  <label :for="index">{{dataset._id}}</label>
					</div>
				  </div>
		
				  <div v-else>
					{{window.signs.no_datasets}}
				  </div>
				</div>
			  </div>
			</div>
		  </div>
		</div>
	`,

	props: ['taskSets', 'dataSets'],

	data() {
		return {
			signs: window.signs,
			selectedTaskSet: null,
			dataSetsList: [],
		};
	},

	computed: {
		selectedDataSets() {
			return this.dataSetsList.filter(dataSet => dataSet.isInTaskSet);
		},
	},

	methods: {
		addTaskSet() {
			const blankTaskSet = {
				assessmentLimit: 0,
				randomSelection: true,
				description: '',
				activeDataSets: [],
			};

			// this.dataSetsList.forEach((dataSet) => {
			// 	dataSet.isInTaskSet = false;
			// });

			// this.dataSetsList.forEach((dataSet) => {
			// 	// dataSet.isInTaskSet = blankTaskSet.activeDataSets.indexOf(dataSet.dataset) >= 0;
			// });

			this.selectedTaskSet = blankTaskSet;
		},

		editTaskSet(taskSet) {
			// this.dataSetsList.forEach((dataSet) => {
			// 	// dataSet.isInTaskSet = taskSet.activeDataSets.indexOf(dataSet.dataset) >= 0;
			// });

			this.selectedTaskSet = $.extend({}, taskSet);
		},

		closeForm() {
			this.selectedTaskSet = null;
		},

		submitForm() {
			const taskSet = this.selectedTaskSet;
			const taskSetId = taskSet._id;

			// Edit user request
			if (taskSetId) {
				window.Request.post(`/api/config/${taskSetId}/edit-taskset`, {
					data: { taskSet },
				})
					.then(() => window.location.reload())
					.catch(() => alert(this.signs.edit_user_error));

			// Add user request
			} else {
				window.Request.post('/api/config/add-taskset', {
					data: { taskSet },
				})
					.then(() => window.location.reload())
					.catch(() => alert(this.signs.add_user_error));
			}
		},

		booleanToReadableString(boolean) {
			return boolean ? this.signs.yes : this.signs.no;
		},
	},

	created() {
		// this.taskSets = this.taskSets.push(this.taskSets[0]);
		this.dataSetsList = [...this.dataSets];

		// this.dataSetsList.forEach((dataSet) => {
		// 	dataSet.isInTaskSet = false;
		// });
	},
};
