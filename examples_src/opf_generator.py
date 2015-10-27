#!/usr/bin/env python
 
import mimetypes
import glob
import os
import os.path
import datetime

 
# Initialize the mimetypes database
mimetypes.init()
# Create the package.opf file
package = open('package.opf', 'w')


title = "Test EPUB"
publisher = "EFL"
publication_date = datetime.date.today().isoformat()
module_id = 1

# WARNING: This glob will add all files and directories
 # to the variable. You will have to edit the file and remove
 # empty directories and the package.opf file reference from
 # both the manifest and the spine
 
path = "./"

package_content = [os.path.join(dirpath, f)
  for dirpath, dirnames, files in os.walk(path)
  for f in files]
#package_content = glob.glob('OPS/**/*')
 
template_top = '''<?xml version='1.0' encoding='utf-8'?>
<package version='3.0'
         unique-identifier='pub-id'
         xmlns='http://www.idpf.org/2007/opf'
         prefix='rendition: http://www.idpf.org/vocab/rendition/#
                 ibooks: http://vocabulary.itunes.apple.com/rdf/ibooks/vocabulary-extensions-1.0/'>
                 
<metadata xmlns:dc='http://purl.org/dc/elements/1.1/'>

  <!-- TITLE -->
  <dc:title>%s</dc:title>
  
  <!-- AUTHOR, PUBLISHER AND PUBLICATION DATES-->
  <dc:creator>%s</dc:creator>
  <dc:publisher>%s</dc:publisher>
  <dc:date>%s</dc:date>

  
  <!-- MISC INFORMATION -->
  <dc:language>en</dc:language>
  <dc:identifier id="book-id">%s</dc:identifier>

</metadata>
<manifest>
 '''
 
template_transition = '''</manifest>
<spine toc="ncx">'''

 
template_bottom = '''</spine>
</package>'''
 
manifest = ""
spine = ""
 
for i, item in enumerate(package_content):
  basename = os.path.basename(item)
  directory = os.path.dirname(item)
  if directory == '.':
    directory = ""
  if directory.startswith('./'):
    directory = directory.replace('./','') + "/"
  if basename != '.DS_Store':
    mime = mimetypes.guess_type(item, strict=True)
    mimeType = mime[0]
    if mimeType is not None:
      
      # skip python files and OPF files
      if mimeType != "text/x-python" and mimeType != "application/oebps-package+xml":
        
        # epub needs to be xhtml
        if mimeType == "text/html":
          mimeType = 'application/xhtml+xml'
          
        if basename == "index.html":
          manifest += '<item id="file_%s" href="%s" media-type="%s" properties="scripted"/>' % (i+1, directory+basename, mimeType) + "\n"
        # nav gets special treatment
        elif basename == "nav.html":
          manifest += '<item id="file_%s" href="%s" media-type="%s" properties="nav"/>' % (i+1, directory+basename, mimeType) + "\n"
        # index get special treatment
        else:
          manifest += '<item id="file_%s" href="%s" media-type="%s"/>' % (i+1, directory+basename, mimeType) + "\n"
          
        if basename == "index.html" and directory == "":
          spine += '<itemref idref="file_%s" />' % (i+1) + "\n"

# I don't remember my python all that well to remember
# how to print the interpolated content.
# This should do for now.
package.write(template_top % (title, publisher, publisher, publication_date, module_id))
package.write(manifest)
package.write(template_transition)
package.write(spine)
package.write(template_bottom)