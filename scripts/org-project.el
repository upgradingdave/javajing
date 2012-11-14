(setq org-publish-project-alist
      '(

        ("org-javajing"
         ;; Path to your org files.
         :base-directory "~/projects/javajing/site/src/main/webapp/org"
         :base-extension "org"

         ;; Path to your Jekyll project.
         :publishing-directory "~/projects/javajing/site/src/main/webapp/jekyll"
         :recursive t
         :publishing-function org-publish-org-to-html
         :headline-levels 4 
         :html-extension "html"
         :body-only t ;; Only export section between <body> </body>
         )

        ("org-static-javajing"
         :base-directory "~/projects/javajing/site/src/main/webapp/org"
         :base-extension "css\\|js\\|png\\|jpg\\|gif\\|pdf\\|mp3\\|ogg\\|swf\\|php"
         :publishing-directory "~/projects/javajing/site/src/main/webapp/jekyll"
         :recursive t
         :publishing-function org-publish-attachment)
        
        ("javajing" :components ("org-javajing" "org-static-javajing"))))

(org-publish-project "javajing")
