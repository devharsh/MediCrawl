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


### Examples

#### Plain Query: http://localhost:8983/solr/nutch/query?q=breast+cancer&fl=url,title
```
{
  "responseHeader":{
    "status":0,
    "QTime":0,
    "params":{
      "q":"breast cancer",
      "fl":"url,title"}},
  "response":{"numFound":1122,"start":0,"docs":[
      {
        "title":"Breast cancer - Symptoms and causes - Mayo Clinic",
        "url":"https://www.mayoclinic.org/diseases-conditions/breast-cancer/symptoms-causes/syc-20352470"},
      {
        "title":"Breast cancer - Diagnosis and treatment - Mayo Clinic",
        "url":"https://www.mayoclinic.org/diseases-conditions/breast-cancer/diagnosis-treatment/drc-20352475"},
      {
        "title":"Breast cancer - Care at Mayo Clinic - Mayo Clinic",
        "url":"https://www.mayoclinic.org/diseases-conditions/breast-cancer/care-at-mayo-clinic/mac-20352479"},
      {
        "title":"Breast cancer: Symptoms, causes, and treatment",
        "url":"https://www.medicalnewstoday.com/articles/37136"},
      {
        "title":"Breast Clinic - Overview - Mayo Clinic",
        "url":"https://www.mayoclinic.org/departments-centers/breast-clinic/sections/overview/ovc-20459469"},
      {
        "title":"Bring Your Brave.",
        "url":"https://bringyourbrave.tumblr.com/"},
      {
        "title":"Breast Cancer News from Medical News Today",
        "url":"https://www.medicalnewstoday.com/categories/breast-cancer"},
      {
        "title":"Breast Cancer | CDC",
        "url":"https://www.cdc.gov/cancer/breast/"},
      {
        "title":"Breast cancer - Doctors and departments - Mayo Clinic",
        "url":"https://www.mayoclinic.org/diseases-conditions/breast-cancer/doctors-departments/ddc-20352478"},
      {
        "title":"Breast Cancer | Disease of the Week | CDC",
        "url":"https://www.cdc.gov/dotw/breastcancer/index.html"}]
  }}
  ```
  
#### Features model: http://localhost:8983/solr/nutch/query?q=breast+cancer&rq={!ltr%20model=myModel%20efi.query=hello+world}&fl=url,title,[features]
```
{
  "responseHeader":{
    "status":0,
    "QTime":1,
    "params":{
      "q":"breast cancer",
      "fl":"url,title,[features]",
      "rq":"{!ltr model=myModel efi.query=hello world}"}},
  "response":{"numFound":1122,"start":0,"docs":[
      {
        "title":"Science Clips - Volume 12, Issue 10, March 23, 2020",
        "url":"https://www.cdc.gov/library/sciclips/issues/index.html",
        "[features]":"originalScore=2.2009563,titleLength=9.0,contentLength=22552.0"},
      {
        "title":"Science Clips - Volume 12, Issue 10, March 23, 2020",
        "url":"https://www.cdc.gov/library/sciclips/issues/",
        "[features]":"originalScore=2.2009563,titleLength=9.0,contentLength=22552.0"},
      {
        "title":"Breast cancer - Diagnosis and treatment - Mayo Clinic",
        "url":"https://www.mayoclinic.org/diseases-conditions/breast-cancer/diagnosis-treatment/drc-20352475",
        "[features]":"originalScore=3.6039774,titleLength=7.0,contentLength=5144.0"},
      {
        "title":"The Topic Is Cancer | Blogs | CDC",
        "url":"https://blogs.cdc.gov/cancer/",
        "[features]":"originalScore=3.3617,titleLength=6.0,contentLength=5144.0"},
      {
        "title":"All Issues - Mayo Clinic Health Letter",
        "url":"https://healthletter.mayoclinic.com/issues",
        "[features]":"originalScore=2.955464,titleLength=6.0,contentLength=5144.0"},
      {
        "title":"Menopause Treatment, Signs, Symptoms & Age",
        "url":"https://www.medicinenet.com/menopause/article.htm",
        "[features]":"originalScore=2.5527363,titleLength=5.0,contentLength=5144.0"},
      {
        "title":"Hormone Therapy for Women: Side Effects, Cancer Risks",
        "url":"https://www.medicinenet.com/hormone_therapy/article.htm",
        "[features]":"originalScore=3.1924405,titleLength=8.0,contentLength=4632.0"},
      {
        "title":"Cáncer de mama - Atención en Mayo Clinic - Mayo Clinic",
        "url":"https://www.mayoclinic.org/es-es/diseases-conditions/breast-cancer/care-at-mayo-clinic/mac-20352479",
        "[features]":"originalScore=3.472774,titleLength=9.0,contentLength=4120.0"},
      {
        "title":"Hot Flashes Causes, Symptoms & Treatment Medicine for Men & Women",
        "url":"https://www.medicinenet.com/hot_flashes/article.htm",
        "[features]":"originalScore=2.7366023,titleLength=9.0,contentLength=3864.0"},
      {
        "title":"Breast cancer - Care at Mayo Clinic - Mayo Clinic",
        "url":"https://www.mayoclinic.org/diseases-conditions/breast-cancer/care-at-mayo-clinic/mac-20352479",
        "[features]":"originalScore=3.6035175,titleLength=8.0,contentLength=3608.0"}]
  }}
```


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
