# Firetable Roadmap

## POC

### Initial fields:

- checkbox(boolean)
- simple text(string) ✅
- email(string)
- phone(string)
- url(string)
- Number(number)
- long text(string)

### Functionality:

- Create Tables (Primary collections) ✅
- Create columns (fields) ✅
- Create rows(documents)
- Edit cells ✅
- Authenicate ✅
- Delete rows ✅

## MVP

### additional fields:

- single select(string)
- [https://material-ui.com/components/chips/#chip-array] Multiple select(array of strings)
- date(Firebase timestamp)
- time(Firebase timestamp)
- file(firebase storage url string)
- image(firebase storage url string)
- single select reference(DocRefrence)
- mulit select reference(DocRefrence)
- [https://material-ui.com/components/rating/] rating(number)

### Functionality:

- Hide/show columns
- Delete columns
- Edit columns
- Delete tables
- Edit tables
- Hide tables
- Fixed column
- keyboard Navigation: ability to use tab and arrow keys to move focus between cells

## V1

### additional fields:

- Percentage(number)
- table(Document[])
- richtext(html string)

### Functionality:

- Sort rows
- Locked columns
- Table view only mode
- Subcollection tables
- Permissions
- Duplicate columns
- Filters:
  - equals to
  - Starts with
  - contains
- Export tables to csv

# V+

### Additional Fields:

- index(number)

### Functionality:

- import csv to table
