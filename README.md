# MediCrawl
A Web Search Engine for Diseases.


## Prerequisites
- Python: https://www.anaconda.com/distribution/#download-section
- Git: https://git-scm.com/
- Git-LFS: https://com.puter.tips/2020/04/install-git-lfs-in-macos.html
- Solr: https://lucene.apache.org/solr/downloads.html
- Nutch: http://nutch.apache.org/downloads.html


## Components of a web search engine
| Functionality | Module Type | Software |
|----------|:-------------:|------:|
| Crawling | Web crawler | Nutch |
| Indexing | Database | Solr |
| Ranking | Database | Solr |
| Searching | User interface | Node.js |


## Procedure
- Download and extract Nutch and Solr in nutch and solr directories
- Modify nutch/conf/nutch-site.xml: set http.agent.name and indexr-solr property
- Modify nutch/conf/schema.xml
- Create a URL seed list: nutch/urls/seed.txt
- cp -r solr/server/solr/configsets/_default solr/server/solr/configsets/nutch
- cp nutch/conf/schema.xml solr/server/solr/configsets/nutch/conf
- rm solr/server/solr/configsets/nutch/conf/managed-schema
- Modify solr/server/solr/configsets/nutch/conf/solrconfig.xml to enable LTR and change _text_ to text
- start solr with LTR: solr/bin/solr start -Dsolr.ltr.enabled=true
- set JAVA_HOME environment variable
- Crawl and Index simultaneously: nutch/bin/crawl -i -D solr.server.url=http://localhost:8983/solr/nutch -s nutch/urls/ Crawl 3
- Test if it succeeded: curl 'http://localhost:8983/solr/nutch/query?q=breast+cancer&fl=url,title'
- Create /path/features.json and /path/model.json
- Upload features to Solr: curl -XPUT 'http://localhost:8983/solr/nutch/schema/feature-store' --data-binary "@./path/features.json" -H 'Content-type:application/json'
- View uploaded features: curl 'http://localhost:8983/solr/nutch/schema/feature-store/_DEFAULT_'
- Test feature extraction: curl 'http://localhost:8983/solr/nutch/query?q=test&fl=id,score,[features]'
- Upload model to Solr: curl -XPUT 'http://localhost:8983/solr/nutch/schema/model-store' --data-binary "@./path/model.json" -H 'Content-type:application/json'
- View uploaded model: curl 'http://localhost:8983/solr/nutch/schema/model-store'
- Test model: curl -g 'http://localhost:8983/solr/nutch/query?q=breast+cancer&rq={!ltr%20model=myModel%20efi.query=breast+cancer}&fl=url,title,[features]'


### Commonly searched diseases
1. Diabetes
2. Depression
3. Anxiety
4. Hemorrhoid
5. Yeast infection
6. Lupus
7. Shingles
8. Psoriasis
9. Schizophrenia
10. Lyme disease
11. HPV
12. Herpes
13. Pneumonia
14. Fibromyalgia
15. Scabies
16. Chlamydia
17. Endometriosis
18. Strep throat
19. Diverticulitis
20. Bronchitis


### References
1. https://www.cs.toronto.edu/~muuo/blog/build-yourself-a-mini-search-engine/
2. https://lucene.apache.org/solr/guide/8_5/learning-to-rank.html
3. https://cwiki.apache.org/confluence/display/nutch/NutchTutorial
4. https://www.statnews.com/2017/06/06/the-20-most-googled-diseases/
