# Firetable Roadmap

## POC ✅

### Initial fields:

- checkbox(boolean) ✅
- simple text(string) ✅
- email(string) ✅
- phone(string) ✅
- url(string) ✅
- Number(number)
- long text(string) ✅

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
- file (single) ✅
- image (single) ✅
- single select reference(DocReference)✅
- multi select reference(DocReference)✅
- rating ✅

### Functionality:

- Delete columns✅
- Edit columns✅
- Fixed column
- Hide/Show columns
- resizable column ✅
- keyboard cell navigation ✅
- column / table Create/edit validation
- On new table add, refresh view to the table view✅
- import csv to table✅

## V1

### additional fields:

- file (multi) ✅
- image (multi) ✅
- Percentage(number)
- Slider(number)
- Table(Document[])
- Rich Text(html string)
- Callable buttons

### Functionality:

- Sort rows
- reorder columns✅
- Auto suggest columns based of existing docs
- Locked columns
- Table view only mode
- SubCollection tables
- Permissions
- Duplicate columns
- Filter columns:
  - equals to
  - Starts with
  - contains
- Export tables to csv✅
- Make a toggle switch to allow single/multi
  - Image
  - File
  - Reference
  - Select
- Mark primary/unique columns
- Import CSV by matching with primary unique key column

# V+

### Additional Fields:

- currency
- count(docs in collection)
- index(number)
- Duration (ss/hh/mm/dd)
- meta fields:
  - createdAt
  - createdBy
  - updatedAt
  - updatedBy

### Functionality:

- Themes
- Table templates
- Dialog View of a row
- multi auth
- Auto detection/suggestions
