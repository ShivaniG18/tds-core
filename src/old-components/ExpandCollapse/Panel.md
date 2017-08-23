## Basic Usage

```
<Group>
  <Panel header="Specs">
    1.21 Gigawatts
  </Panel>
  <Panel header="Accessories">
    Charging cable, bumper case.
  </Panel>
  <Panel header="Warranty">
    1 Year, no questions asked.
  </Panel>
</Group>
```

## Accordion

Accordion is a special kind of Collapse, which allows only one panel to be expanded at a time.

```
<Group accordion>
  <Panel header="Specs">
    <p>A fast CPU, a striking GPU.</p>
  </Panel>
  <Panel header="Colours">
    <p>Everything from tulips to crimsons.</p>
  </Panel>
</Group>
```

## Disabling panels

```
<Group disabledKeys={["warranty"]}>
  <Panel header="Current Terms">
    Product is provided as-is.
  </Panel>
  <Panel header="Future Terms" panelKey="warranty">
    Under construction.
  </Panel>
</Group>
```

## Controlling the expanded panels externally

We can control the Expand/Collapse component state.

```
initialState = {
  activeKeys: []
};

const togglePanel = (panelKey) => {
  if (state.activeKeys.indexOf(panelKey) > -1) {
    setState({
      activeKeys: state.activeKeys.filter(k => k !== panelKey)
    });
  }
  else {
    setState({
      activeKeys: state.activeKeys.concat([panelKey])
    });
  }
};

<div>
  <button className="button button--secondary button--link"
    onClick={() => togglePanel('panel-1')}>Toggle panel #1</button>
  <button className="button button--secondary button--link"
    onClick={() => togglePanel('panel-2')}>Toggle panel #2</button>

  <Group activeKeys={state.activeKeys}>
    <Panel header="Panel #1" panelKey="panel-1">
    Panel #1 Body
    </Panel>
    <Panel header="Panel #2" panelKey="panel-2">
    Panel #2 Body
    </Panel>
  </Group>
</div>
```