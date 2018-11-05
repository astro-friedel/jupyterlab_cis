import {
  JupyterLab, JupyterLabPlugin, ILayoutRestorer
} from '@jupyterlab/application';

import {
  ICommandPalette, InstanceTracker//, ToolbarButton
} from '@jupyterlab/apputils';

/*
import {
  NotebookActions, NotebookPanel, INotebookModel
} from '@jupyterlab/notebook';

import {
  DocumentRegistry
} from '@jupyterlab/docregistry';
*/

import {
  JSONExt
} from '@phosphor/coreutils';

import {
  Message
} from '@phosphor/messaging';

import {
  Widget
} from '@phosphor/widgets';

import '../style/index.css';

/**
 * A Crops in Silico Model Composer.
 */
class CisWidget extends Widget {
  constructor() {
    super();

    this.id = 'cis-jupyterlab';
    this.title.label = 'Model Composer';
    this.title.closable = true;
    this.addClass('cis-iframe');

    // HACK: Create an iframe to cis-ui
    this.iframe = document.createElement('iframe');
    this.iframe.width = '100%';
    this.iframe.height = '100%';
    this.node.appendChild(this.iframe);
    this.iframe.src = 'https://dev.cis-iu.ndslabs.org/#/';
  }

  // The iframe element associated with the widget.
  readonly iframe: HTMLIFrameElement;

  onUpdateRequest(msg: Message): void {
  }
};


function activate(app: JupyterLab, palette: ICommandPalette, restorer: ILayoutRestorer) {
  console.log('JupyterLab extension jupyterlab_cis is activated!');

  // Declare a widget variable
  let widget: CisWidget;
  
  

  // Add an application command
  app.commands.addCommand('cis:open-model-composer', {
    label: 'Show Model Composer',
    execute: () => {
      if (!widget) {
        // Create a new widget if one does not exist
        widget = new CisWidget();
        widget.update();
      }
      if (!tracker.has(widget)) {
        // Track the state of the widget for later restoration
        tracker.add(widget);
      }
      if (!widget.isAttached) {
        // Attach the widget to the main work area if it's not there
        app.shell.addToMainArea(widget);
      } else {
        // Refresh the comic in the widget
        widget.update();
      }
      // Activate the widget
      app.shell.activateById(widget.id);
    }
  });
  
    // Add an application command
  /*app.commands.addCommand('cis:execute-graph-from-clipboard', {
    label: 'Execute Graph from Clipboard',
    execute: () => {
      let clipboardContents = "asdf"
      console.log("Executing graph: ", clipboardContents);
    }
  });*/

  // Add commands to the palette.
  palette.addItem({ command: 'cis:open-model-composer', category: 'Crops in Silico' });
  //palette.addItem({ command: 'cis:execute-graph-from-clipboard', category: 'Crops in Silico' });

  // Track and restore the widget state
  let tracker = new InstanceTracker<Widget>({ namespace: 'cis' });
  restorer.restore(tracker, {
    command: 'cis:open-model-composer',
    args: () => JSONExt.emptyObject,
    name: () => 'cis'
  });
};


//Initialization data for the jupyterlab_cis extension.
const extension: JupyterLabPlugin<void> = {
  id: 'jupyterlab_cis',
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer],
  activate: activate
};

export default extension;
