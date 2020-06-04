import {
  JupyterFrontEnd, JupyterFrontEndPlugin, ILayoutRestorer
} from '@jupyterlab/application';

import {
  ICommandPalette, WidgetTracker//, ToolbarButton
} from '@jupyterlab/apputils';

import { ILauncher } from '@jupyterlab/launcher';

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
} from '@lumino/coreutils';

import {
  Message
} from '@lumino/messaging';

import {
  Widget
} from '@lumino/widgets';

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
    this.iframe.src = 'https://cis-tacc.ndslabs.org/#/';
  }

  // The iframe element associated with the widget.
  readonly iframe: HTMLIFrameElement;

  onUpdateRequest(msg: Message): void {
  }
};


function activate(app: JupyterFrontEnd, palette: ICommandPalette, restorer: ILayoutRestorer, launcher: ILauncher) {
  console.log('JupyterLab extension jupyterlab_cis is activated!');

  // Declare a widget variable
  let widget: CisWidget;



  // Add an application command
  app.commands.addCommand('cis:open-model-composer', {
    label: 'Model Composer',
    iconClass: 'jp-VegaIcon',
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
        app.shell.add(widget);
      } else {
        // Refresh the comic in the widget
        widget.update();
      }
      // Activate the widget
      app.shell.activateById(widget.id);
    }
  });

  // Add commands to the palette.
  palette.addItem({ command: 'cis:open-model-composer', category: 'Crops in Silico' });

  // Add a launcher item if the launcher is available
  if (launcher) {
    launcher.add({
      command: 'cis:open-model-composer',
      category: 'Crops in Silico',
      rank: 0
    });
  } else {
    console.log('No launcher found... skipping adding launcher icon');
  }

  // Track and restore the widget state
  let tracker = new WidgetTracker<Widget>({ namespace: 'cis' });
  restorer.restore(tracker, {
    command: 'cis:open-model-composer',
    args: () => JSONExt.emptyObject,
    name: () => 'cis'
  });
};


//Initialization data for the jupyterlab_cis extension.
const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab_cis',
  autoStart: true,
  requires: [ICommandPalette, ILayoutRestorer, ILauncher],
  activate: activate
};

export default extension;
