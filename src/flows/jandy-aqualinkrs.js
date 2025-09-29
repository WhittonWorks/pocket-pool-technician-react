{
  "id": "jandy-hie2-v1",
  "brand": "Jandy",
  "equipmentType": "Heaters",
  "model": "HI-E2",
  "title": "Jandy Hi-E2 Heater — Guided Troubleshooting",
  "start": "s1",
  "nodes": {
    "s1": {
      "id": "s1",
      "text": "Check incoming power supply: Measure 120 VAC at Black & White (transformer input). Voltage present?",
      "input": "number",
      "unit": "VAC",
      "range": [110, 126],
      "pass": "s2",
      "fail": "fix_power"
    },
    "fix_power": {
      "id": "fix_power",
      "text": "No proper line voltage. Correct incoming power supply.",
      "input": "info",
      "terminal": true
    },
    "s2": {
      "id": "s2",
      "text": "Check transformer: 24 VAC at Red & Yellow wires.",
      "input": "number",
      "unit": "VAC",
      "range": [22, 26],
      "pass": "s3",
      "fail": "replace_transformer"
    },
    "replace_transformer": {
      "id": "replace_transformer",
      "text": "Replace transformer and recheck system.",
      "input": "info",
      "terminal": true
    },
    "s3": {
      "id": "s3",
      "text": "Check White wire terminal block fuse. Good?",
      "input": "yesno",
      "pass": "s4",
      "fail": "replace_fuse"
    },
    "replace_fuse": {
      "id": "replace_fuse",
      "text": "Fuse blown. Look for short, overload, or improper load. Replace fuse.",
      "input": "info",
      "terminal": true
    },
    "s4": {
      "id": "s4",
      "text": "Check Fireman’s switch, remote, and wire connections. Good?",
      "input": "yesno",
      "pass": "s5",
      "fail": "repair_fireman"
    },
    "repair_fireman": {
      "id": "repair_fireman",
      "text": "Repair/replace Fireman’s switch wiring.",
      "input": "info",
      "terminal": true
    },
    "s5": {
      "id": "s5",
      "text": "Check Pressure Switch: 24 VAC at Purple & Yellow wires.",
      "input": "number",
      "unit": "VAC",
      "range": [22, 26],
      "pass": "s6",
      "fail": "check_flow"
    },
    "check_flow": {
      "id": "check_flow",
      "text": "Verify pump on, filter clean, backwash, check water flow. Replace Pressure Switch if bad.",
      "input": "info",
      "terminal": true
    },
    "s6": {
      "id": "s6",
      "text": "Check Thermostat: Is Temp Board calling for heat?",
      "input": "yesno",
      "pass": "s7",
      "fail": "check_thermistor"
    },
    "check_thermistor": {
      "id": "check_thermistor",
      "text": "Remove thermistor leads, measure resistance with meter. Compare to Thermistor Chart (20kΩ scale). Replace thermistor or temp board if out of spec.",
      "input": "info",
      "terminal": true
    },
    "s7": {
      "id": "s7",
      "text": "Check Ignition Control: 24 VAC between Black/Yellow & Yellow wires.",
      "input": "number",
      "unit": "VAC",
      "range": [22, 26],
      "pass": "s8",
      "fail": "replace_ign_ctrl"
    },
    "replace_ign_ctrl": {
      "id": "replace_ign_ctrl",
      "text": "Replace ignition control board.",
      "input": "info",
      "terminal": true
    },
    "s8": {
      "id": "s8",
      "text": "Is blower running?",
      "input": "yesno",
      "pass": "s9",
      "fail": "check_blower"
    },
    "check_blower": {
      "id": "check_blower",
      "text": "Check blower wiring, relay, or replace blower motor.",
      "input": "info",
      "terminal": true
    },
    "s9": {
      "id": "s9",
      "text": "Is Hot Surface Ignitor glowing?",
      "input": "yesno",
      "pass": "s10",
      "fail": "test_ignitor"
    },
    "test_ignitor": {
      "id": "test_ignitor",
      "text": "Disconnect ignitor, measure resistance (40–75 Ω). Replace ignitor if open/out of spec.",
      "input": "info",
      "terminal": true
    },
    "s10": {
      "id": "s10",
      "text": "After ignitor glows, check for gas valve activation: 24 VAC at Brown & Yellow wires.",
      "input": "number",
      "unit": "VAC",
      "range": [22, 26],
      "pass": "s11",
      "fail": "replace_gas_valve"
    },
    "replace_gas_valve": {
      "id": "replace_gas_valve",
      "text": "Replace gas valve.",
      "input": "info",
      "terminal": true
    },
    "s11": {
      "id": "s11",
      "text": "Do burners ignite and stay lit?",
      "input": "yesno",
      "pass": "success",
      "fail": "check_flame"
    },
    "check_flame": {
      "id": "check_flame",
      "text": "Check flame rectification: ground, sensor cleanliness, gas pressure, ignitor condition. Replace ignition control if unresolved.",
      "input": "info",
      "terminal": true
    },
    "success": {
      "id": "success",
      "text": "Heater operating normally ✅",
      "input": "info",
      "terminal": true,
      "success": true
    }
  }
}