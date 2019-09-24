# Firetable Roadmap

## POC

### Initial fields:

- checkbox(boolean) ✅
- simple text(string) ✅
- email(string) ✅
- phone(string) ✅
- url(string) ✅
- Number(number) ✅
- long text(string)

### Functionality:

- Create Tables (Primary collections) ✅
- Create columns (fields) ✅
- Create rows(documents) ✅
- Edit cells ✅
- Authenticate ✅
- Delete rows ✅

## MVP

### additional fields:

- single select(string)✅
- Multiple select(array of strings)✅
- date(Firebase timestamp)✅
- time(Firebase timestamp)✅
- file(firebase storage url string)
- image ✅
- single select reference(DocReference)
- multi select reference(DocReference)
- rating ✅

### Functionality:

- Delete columns✅
- Edit columns✅
- Fixed column
- Hide/Show columns
- resizable column ✅
- keyboard Navigation:
  - Up key to move to the cell above ✅
  - Down key to move to the cell bellow, if last cell create a new row ✅
  - Tab to go to the next cell ✅
- column / table Create/edit validation
- Delete tables
- Edit tables
- Hide tables
- On new table add, refresh view to the table view✅

## V1

### additional fields:

- Duration
- Percentage(number)
- Table(Document[])
- Rich Text(html string)

### Functionality:

- Sort rows
- Locked columns
- Table view only mode
- SubCollection tables
- Permissions
- Duplicate columns
- Filters:
  - equals to
  - Starts with
  - contains
- Export tables to csv

# V+

### Additional Fields:

- currency
- count(docs in collection)
- index(number)
- meta fields:
  - createdAt
  - createdBy
  - updatedAt
  - updatedBy

### Functionality:

- import csv to table
- Themes
- Table templates
- Dialog View of a row
