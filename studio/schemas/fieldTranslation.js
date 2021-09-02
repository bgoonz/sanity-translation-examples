import { languages, baseLanguage } from './languages'

// This is the basis for all fields that should have translations.
// Its used to fill out more complete field definitions in
// 'translateDocs' below
const languageField = {
  type: 'object',
  fieldsets: [
    {
      title: 'Translations',
      name: 'translations',
      options: { collapsible: true }
    },
  ],
}

// We need to figure out which language to map the preview
// of this document to. Use the 'localizedPreview' object
// to point to the base language properties. This does not
// support custom previews, only the build in 'title', 'subtitle'
// and 'media' properties.
const localizePreview = (preview) => {
  if (!preview) return null
  const { select } = preview
  if (!select) return null
  return {
    select: {
      ...(select.title
        && { title: `${select.title}.${baseLanguage.name}` }),
      ...(select.subtitle
        && { subtitle: `${select.subtitle}.${baseLanguage.name}` }),
      ...(select.media
        && { media: `${select.media}.${baseLanguage.name}` }),
    }
  }
}

export const translateFields = (docs) => {
  const documents = docs.map((doc) => {
    // Change all the fields to object versions with properties for each
    // language, if either the document has localize: true or individual fields
    const fields = doc.fields.map(field => {
      const shouldLocalize = field.type !== 'reference' && (doc.localize || field.localize)
      // Use the field defined as-is if its not to be translated
      if (!shouldLocalize || field.localize === false) return field

      return {
        ...languageField,
        name: field.name,
        fields: languages.map((language, i) => ({
          ...field,
          title: language.title,
          name: language.name,
          // All other languages except the first one is collapsed by default
          fieldset: i === 0 ? null : 'translations',
        }))
      }
    })

    return {
      ...doc,
      preview: localizePreview(doc.preview) || doc.preview,
      fields
    }
  })

  return documents
}