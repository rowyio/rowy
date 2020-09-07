# Firetable Roadmap

## POC ✅

### Initial fields:

- checkbox(boolean) ✅
- simple text(string) ✅
- email(string) ✅
- phone(string) ✅
- url(string) ✅
- Number(number) ✅
- long text(string) ✅

### Functionality:

- Create Tables (Primary collections) ✅
- Create columns (fields) ✅
- Create rows(documents) ✅
- Edit cells ✅
- Authenticate ✅
- Delete rows ✅

## MVP ✅

### additional fields:

- single select(string) ✅
- Multiple select(array of strings) ✅
- date(Firebase timestamp) ✅
- time(Firebase timestamp) ✅
- file (single) ✅
- image (single) ✅
- single select reference(DocReference) ✅
- multi select reference(DocReference) ✅
- rating ✅

### Functionality:

- Delete columns✅
- Edit columns✅
- Fixed column ✅
- Hide/Show columns ✅
- resizable column ✅
- keyboard cell navigation ✅
- column / table Create/edit  ✅
- import csv to table ✅

## V1

### additional fields:

- json ✅
- file (multi) ✅
- image (multi) ✅
- Percentage(number)
- Slider(number) ✅
- Table(Document[]) ✅
- Rich Text(html string)) ✅
- Callable buttons ✅
- meta fields:✅
  - createdAt
  - createdBy
  - updatedAt
  - updatedBy

### Functionality:

- Sort rows ✅
- reorder columns ✅
- Auto suggest columns based of existing docs ✅
- Locked columns ✅
- SubCollection tables ✅
- Permissions✅
- Duplicate columns
- Filter columns:✅
  - equals to✅
  - Starts with
  - contains ✅
- Export tables to csv ✅
- Dialog View of a row(SideDrawer) ✅
- Import CSV by matching with primary unique key column

# V+

### Additional Fields:

- currency
- Derivative
- count(docs in collection)
- index(number)
- Duration (ss/hh/mm/dd) 


### Functionality:

- Themes
- Table templates
- multi auth
- Table view only mode
- Make a toggle switch to allow single/multi
  - Image
  - File
  - Reference
  - Select
- Mark primary/unique columns
- Webhooks
- Firestore Rules automation
