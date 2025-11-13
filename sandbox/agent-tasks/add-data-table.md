# Add Data Table

## Instructions to Copilot
- read this document entirely
- ask any clarifying questions
- help me edit this document if questions are not clear
- do not take any action until we have agreed that the scope of work is clear
- do not make any git commits, that will be up to me
- once scope of work is agreed on and I have told you to proceed, you may begin gathering data and saving the output
- we will work in steps as outlined below, and complete one step before moving to the next step. i will approve each step before we move to the next one.
- we will ONLY clarify each step one at a time. So we will clarify this doc first. then we will move to step one. we will clarify and edit this doc, do that work, and pause. we will not clarify step two or work on it until step one is done.



## scope of work

we want to add a data table to our tide-chart.tsx render method

the data table will follow the format of ./sandbox/data-below-chart.md

where there is an "i" in the data table, we will output an icon

## steps

### step one

- create a new method in tide-chart.tsx to normalize and sort our sun, tide, and moon data
- place the method above the getSvg() method
- the method should return an array or collection of dates and activity code (sun rise, sun set, moon rise, moon set, tide high, tide low) and additional activity data attribute (tide height, moon illumination)
- only include events within the user's selected date range (this.beginDate to this.endDate), using local time
- this is a data method only, no html or jsx shall be produced.

### step two

- create a new method in tide-chart.tsx to output jsx for our data table
- place the method above getSvg() and below the method from step two in the file
- the method should return jsx suitable for use by our render() method
- the method should return a table in the same format as used by the sunSection block in our render method
- the table, rows, header, and cells should have new classes. use the class prefix "userData" and each element type should have its own class
- the method should get the data from method written in step one
- in our data table mockup, where you see an "i" before an activity, that represents an icon we want to output. use these icons:
  - 🌙 \u{1F319} for moon rise or set
  - ☀ \u2600 for sun rise or set
  - 💧 \u{1F4A7} for high or low tide
- for any table row that occurs on or after sunrise, and before or on sunset, emit a different class such as "userDataSunup". for other table rows, use a different class such as "userDataSundown"
- the table has 5 columns: Day, Time, Activity, (data), Date
  - Day column: day of week (e.g., "Sat", "Sun")
  - Time column: time in format "h:mm am/pm" (e.g., "6:50 am")
  - Activity column: activity name (e.g., "Sunrise", "Moonrise", "Low Tide", "High Tide")
  - Data column: tide height for tides (e.g., "-0.169 ft"), moon illumination for moon events (e.g., "6%"), empty for sun events
  - Date column: date in format "YYYY-MM-DD" (e.g., "2025-11-22")

### step three
- in tide-chart.tsx render() method, where chart is assigned, place the resulting JSX from step two's method after the svg data and before the button to toggle debug info

### step four
- we will style the user data table.