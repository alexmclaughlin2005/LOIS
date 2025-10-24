# Testing Guide - Phase 3.1 Multi-Entity Result Cards

**Date**: October 24, 2025
**Purpose**: Test new card components with real data

---

## 🚀 Quick Start

### 1. Start Development Server
```bash
cd /Users/alexmclaughlin/Desktop/Cursor\ Projects/LOIS/frontend
npm run dev
```

The app should open at: http://localhost:5173

---

## 🧪 Test Scenarios

### Test 1: Project/Case Cards
**Query to ask LOIS**:
```
Show me all open personal injury cases
```

**Expected Result**:
- ProjectCard components should render
- Each card shows:
  - 🩹 Personal Injury icon
  - Case title and number
  - Green "Open" badge
  - "Discovery" or other phase badge
  - Attorney with avatar
  - Filing date
  - Estimated value (if available)
  - Medical expenses (custom field for PI cases)

**Screenshot Location**: Take screenshot and save as `screenshots/test1-project-cards.png`

**Validation Checklist**:
- [ ] Cards render (not tables)
- [ ] Case numbers are displayed
- [ ] Status badges show correct colors
- [ ] Attorney avatars show initials
- [ ] Quick action buttons appear at bottom
- [ ] Cards have hover effects

---

### Test 2: Contact Cards
**Query to ask LOIS**:
```
Show me all attorneys
```
OR
```
Find all contacts
```

**Expected Result**:
- ContactCard components should render
- Each card shows:
  - Large avatar with initials and gradient
  - Contact name
  - "Attorney" badge with ⚖️ icon (or appropriate contact type)
  - Organization and title
  - Email (clickable)
  - Phone (clickable)
  - Bar number (for attorneys)

**Screenshot Location**: `screenshots/test2-contact-cards.png`

**Validation Checklist**:
- [ ] Cards render (not tables)
- [ ] Avatars show correct initials
- [ ] Contact type badge shows correct icon and color
- [ ] Email and phone are clickable links
- [ ] Professional info section appears for attorneys
- [ ] Quick action buttons work

---

### Test 3: Document Cards
**Query to ask LOIS**:
```
Show me all documents
```
OR
```
Find documents for case CV-2025-00123
```
(Replace with actual case number from your database)

**Expected Result**:
- DocumentCard components should render
- Each card shows:
  - Document icon (color-coded by type)
  - Document title
  - Case number association
  - Document type badge (Pleading, Discovery, etc.)
  - Status badge (Filed, Draft, etc.)
  - File type badge (PDF, DOCX, etc.)
  - Content preview (first 150 chars)
  - Filed date
  - File size

**Screenshot Location**: `screenshots/test3-document-cards.png`

**Validation Checklist**:
- [ ] Cards render (not tables)
- [ ] Document type icons show correct color
- [ ] Case number appears and is correct
- [ ] Content preview shows (if content exists)
- [ ] File metadata displays correctly
- [ ] Tags appear (if document has tags)

---

### Test 4: Mixed Results (Grouped View)
**Query to ask LOIS**:
```
Search for "Smith"
```
(This might return cases, contacts, and documents related to Smith)

**Expected Result**:
- ResultsRenderer shows tabs: "All", "Cases", "Contacts", "Documents"
- Summary shows: "Found **X** results (Y cases, Z contacts, W documents)"
- Default view shows all results grouped by type with section headers
- Clicking tabs filters to that entity type only

**Screenshot Location**: `screenshots/test4-mixed-results.png`

**Validation Checklist**:
- [ ] Tabs appear at top
- [ ] Summary text shows breakdown by type
- [ ] Section headers appear in "All" view
- [ ] Each section shows correct card type
- [ ] Clicking tabs switches view correctly
- [ ] Active tab is highlighted

---

### Test 5: Empty Results
**Query to ask LOIS**:
```
Show me cases filed in year 3000
```
(Intentionally impossible query)

**Expected Result**:
- No results icon and message: "No results found"
- Graceful empty state

**Screenshot Location**: `screenshots/test5-empty-results.png`

**Validation Checklist**:
- [ ] Empty state shows (not error)
- [ ] Icon and message are centered
- [ ] No console errors

---

### Test 6: Unknown Entity Type (Fallback)
**Query to ask LOIS**:
```
Show me calendar entries
```
OR
```
Show me time entries
```

**Expected Result**:
- If CalendarCard/TimeEntryCard not yet built, should show generic JSON view
- Graceful fallback to structured data display

**Screenshot Location**: `screenshots/test6-fallback.png`

**Validation Checklist**:
- [ ] Data displays (even if not as fancy cards)
- [ ] No errors or crashes
- [ ] JSON is readable

---

## 🐛 Bug Reporting Template

If you find issues, document them like this:

### Bug Example
**Test**: Test 2 - Contact Cards
**Issue**: Attorney bar number not displaying
**Expected**: Bar number should show in professional info section
**Actual**: Professional info section is empty
**Screenshot**: `screenshots/bug-bar-number.png`
**Data**: Contact ID 123, bar_number field value: "CA12345"

---

## ✅ Success Criteria

Phase 3.1 is ready to ship when:
- [ ] All 6 test scenarios pass
- [ ] No console errors during testing
- [ ] Cards render for at least 3 entity types (project, contact, document)
- [ ] Entity type detection works >90% of the time
- [ ] Tabs work correctly for mixed results
- [ ] Mobile layout looks good (test on phone or resize browser)

---

## 📝 Test Results Log

### Test Date: ___________
### Tester: ___________

| Test # | Pass/Fail | Notes |
|--------|-----------|-------|
| 1 | ⬜ | |
| 2 | ⬜ | |
| 3 | ⬜ | |
| 4 | ⬜ | |
| 5 | ⬜ | |
| 6 | ⬜ | |

---

## 🔧 Troubleshooting

### Issue: Dev server won't start
**Solution**: Check if port 5173 is already in use
```bash
lsof -ti:5173 | xargs kill -9
npm run dev
```

### Issue: Cards not rendering, still showing table
**Solution**: Clear browser cache and hard refresh (Cmd+Shift+R)

### Issue: Entity type detection wrong
**Solution**: Check console logs for detection scores
```javascript
// In ResultsRenderer.svelte, the detectEntityType function logs scores
// Look for: "Project score: X, Contact score: Y, Document score: Z"
```

### Issue: Styling looks broken
**Solution**: Ensure Tailwind CSS is loaded
```bash
# Check browser console for CSS errors
# Verify app.css is imported in +layout.svelte
```

### Issue: Environment variable errors
**Solution**: Create `.env` file in frontend directory:
```bash
cd frontend
cat > .env << EOF
PUBLIC_SUPABASE_URL=your-url
PUBLIC_SUPABASE_ANON_KEY=your-key
SUPABASE_URL=your-url
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
ANTHROPIC_API_KEY=your-anthropic-key
EOF
```

---

## 📸 Screenshots Directory Structure

Create this folder structure for organized testing:
```
screenshots/
├── test1-project-cards.png
├── test2-contact-cards.png
├── test3-document-cards.png
├── test4-mixed-results.png
├── test5-empty-results.png
├── test6-fallback.png
└── bugs/
    ├── bug-description-1.png
    └── bug-description-2.png
```

---

## 🎯 Performance Testing

### Load Time
- Query with 10 results: Should render in < 100ms
- Query with 100 results: Should render in < 500ms
- Query with 500 results: Should render in < 2s (with pagination in future)

### Interaction
- Tab switching: < 50ms
- Hover effects: Smooth, no jank
- Quick action buttons: Immediate response

---

## 📱 Mobile Testing

Test on phone or resize browser to 375px width:
- [ ] Cards stack vertically (no horizontal scroll)
- [ ] Text is readable
- [ ] Buttons are tappable (not too small)
- [ ] Metadata grid becomes single column
- [ ] Quick actions stack vertically

---

## ✨ Next Steps After Testing

1. **Document findings** in `TESTING_RESULTS.md`
2. **Fix critical bugs** before moving to Phase 3.2
3. **Commit working code**:
   ```bash
   git add .
   git commit -m "feat: Complete Phase 3.1 - Multi-entity result cards tested and working"
   git push
   ```
4. **Deploy to Vercel** to test in production
5. **Start Phase 3.2**: Conversation persistence

---

**Happy Testing!** 🚀

If everything works, you've just transformed LOIS from showing basic tables to displaying beautiful, professional result cards that automatically adapt to your data! 🎉
