import { ExpandMoreOutlined } from "@material-ui/icons";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import { Grid, Typography } from "@material-ui/core";
import React, { useEffect, useState } from "react";

import { ProjectService } from "../../data/services";
import MultipleSelect from "../MultipleSelect";

const ProjectPanel = (props) => {
  const [isProjectsLoading, setProjectsLoading] = useState(false);
  const [isTasksLoading, setTasksLoading] = useState(false);
  const [selectedProject, setProject] = useState([]);
  const [selectedTask, setTask] = useState([]);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [taskPlaceHolder, setTaskPlaceHolder] = useState("Select task");
  const [isProjectViewOnly] = useState(props.loadProjectViewOnly);

  useEffect(() => {
    let allProjects = [];
    let sProjId = props.project_id;
    // console.debug('project', 'id', sProjId);
    setProjectsLoading(true);
    ProjectService.getProjects().then((response) => {
      setProjectsLoading(false);

      response.values.projectList.map((project, index) => {
        let mProject = {
          value: project.project_id,
          label: project.projectName,
        };
        return allProjects.push(mProject);
      });

      if (sProjId !== null) {
        //console.debug('sProjId', sProjId);
        let sProject = allProjects.find((element) => {
          // console.debug(element.value === sProjId);
          return element.value === sProjId;
        });
        // console.debug('project', 'selected project', sProject);
        if (sProject !== undefined) {
          let _projects = [];
          _projects.push(sProject);
          handleProjectChange(_projects);
        }
      }

      setProjects(allProjects);
    });
  }, []);

  const handleProjectChange = (project) => {
    let _project = project[0];
    console.debug("selected project", _project);

    if (_project === undefined) {
      _project = null;
    }

    props.handleProjectChange(_project);

    setProject(project); // This should be an array.
    setTask(null);
    setTasks([]);
    setTaskPlaceHolder("Select task");

    if (_project !== null) {
      let sTaskId = props.task_id;
      let allProjectTaks = [];
      setTasksLoading(true);
      ProjectService.getProjectTasks(_project.value).then((response) => {
        setTasksLoading(false);
        let mPlaceHolder = "";
        response.values.taskList.map((task, index) => {
          if (index === 0) {
            mPlaceHolder = task.task_short_name;
          }
          let mTask = {
            value: task.task_id,
            label: task.task_title,
          };
          return allProjectTaks.push(mTask);
        });

        setTasks(allProjectTaks);
        setTaskPlaceHolder(mPlaceHolder);

        if (sTaskId !== null) {
          let sTask = allProjectTaks.find((element) => {
            return element.value === sTaskId;
          });

          if (sTask !== undefined) {
            let _tasks = [];
            _tasks.push(sTask);
            handleProjectTaskChange(_tasks);
          }
        }
      });
    }
  };

  const handleProjectTaskChange = (task) => {
    let _task = task[0];
    console.debug("selected task", _task);

    if (_task === undefined) {
      _task = null;
    }

    props.handleTaskChange(_task);
    // console.debug(task);
    setTask(task);
  };

  return isProjectViewOnly !== undefined ? (
    <MultipleSelect
      isLoading={isProjectsLoading}
      items={projects}
      selectedItems={selectedProject}
      isMultiple={false}
      onChange={handleProjectChange}
      placeHolder={"Select Project"}
    />
  ) : (
    <ExpansionPanel>
      <ExpansionPanelSummary expandIcon={<ExpandMoreOutlined />}>
        <Typography color={"secondary"} variant={"body1"}>
          Link Project
        </Typography>
      </ExpansionPanelSummary>
      <ExpansionPanelDetails>
        <Grid
          space={12}
          container
          direction="row"
          justify="space-evenly"
          alignItems="flex-start"
        >
          <Grid item xs={12}>
            <div className="meetingView">
              <Typography variant={"body1"}>Project</Typography>
              <MultipleSelect
                isLoading={isProjectsLoading}
                items={projects}
                selectedItems={selectedProject}
                isMultiple={false}
                onChange={handleProjectChange}
                placeHolder={"Select Project"}
              />
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className="meetingView">
              <Typography variant={"body1"}>Task</Typography>
              <MultipleSelect
                isLoading={isTasksLoading}
                items={tasks}
                selectedItems={selectedTask}
                isMultiple={false}
                onChange={handleProjectTaskChange}
                placeHolder={taskPlaceHolder}
              />
            </div>
          </Grid>
        </Grid>
      </ExpansionPanelDetails>
    </ExpansionPanel>
  );
};

export default ProjectPanel;
