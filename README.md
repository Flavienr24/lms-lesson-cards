# LMS Lesson Component

This component represents a lesson card for a Learning Management System. Each lesson can have 0 or multiple topics, which are children of the lesson.

## Features

- Lessons with no topics display only the title
- Lessons with topics display the title, number of topics, and a dropdown button
- First lesson opens automatically, with the first topic in "play" mode
- On hover over topics, the text changes to orange and semi-bold, and a play icon appears
- Only one lesson can be open at a time
- Validated topics display a check icon and blue semi-bold text
- Validated lessons show a check icon
- Text animation (shifting 12px right) on topic hover

## Files

- `index.html`: The main HTML structure with examples of different lesson states
- `styles.css`: All styling for the component, following the design specifications
- `script.js`: JavaScript for handling interactions and animations

## States

### Lesson States
- `ready`: Ready to play or hover state
- `default`: Normal state
- `inactive`: Disabled/inactive state
- `validated`: All topics completed
- `open`: Lesson is expanded showing topics
- `validated-open`: Validated lesson that is expanded

### Topic States
- `default`: Normal state
- `play`: Currently selected topic
- `validated`: Completed topic

## Interactions

- Click on a lesson header to expand/collapse topics
- Hover over topics to see the animation and play icon
- Click on a topic to set it to "play" state

## Design Specifications

- Background: #FFFFFF (white)
- Stroke: #BDBDDF
- Effects: Card Shadow Mobile (X=5, Blur=25, Black 5%)
- Title Text: Poppins 14/18
  - Semi-bold for active states
  - Regular for default states
  - Colors: 
    - Tangerine #D54233 (hover/play)
    - Black #000000 (default)
    - Grey #868686 (inactive)
    - Blue #2422A6 (validated)
