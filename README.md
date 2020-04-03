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
  
#### Features model: http://localhost:8983/solr/nutch/query?q=breast+cancer&rq={!ltr%20model=myModel%20efi.query=breast+cancer}&fl=url,title,[features]
```
{
  "responseHeader":{
    "status":0,
    "QTime":8,
    "params":{
      "q":"breast cancer",
      "fl":"url,title,[features]",
      "rq":"{!ltr model=myModel efi.query=breast cancer}"}},
  "response":{"numFound":1122,"start":0,"docs":[
      {
        "title":"Science Clips - Volume 12, Issue 10, March 23, 2020",
        "url":"https://www.cdc.gov/library/sciclips/issues/index.html",
        "[features]":"originalScore=2.2747984,titleLength=9.0,contentLength=22552.0"},
      {
        "title":"Science Clips - Volume 12, Issue 10, March 23, 2020",
        "url":"https://www.cdc.gov/library/sciclips/issues/",
        "[features]":"originalScore=2.2747984,titleLength=9.0,contentLength=22552.0"},
      {
        "title":"Breast cancer - Diagnosis and treatment - Mayo Clinic",
        "url":"https://www.mayoclinic.org/diseases-conditions/breast-cancer/diagnosis-treatment/drc-20352475",
        "[features]":"originalScore=3.7579455,titleLength=7.0,contentLength=5144.0"},
      {
        "title":"The Topic Is Cancer | Blogs | CDC",
        "url":"https://blogs.cdc.gov/cancer/",
        "[features]":"originalScore=3.5015173,titleLength=6.0,contentLength=5144.0"},
      {
        "title":"All Issues - Mayo Clinic Health Letter",
        "url":"https://healthletter.mayoclinic.com/issues",
        "[features]":"originalScore=3.071907,titleLength=6.0,contentLength=5144.0"},
      {
        "title":"Menopause Treatment, Signs, Symptoms & Age",
        "url":"https://www.medicinenet.com/menopause/article.htm",
        "[features]":"originalScore=2.6457264,titleLength=5.0,contentLength=5144.0"},
      {
        "title":"Hormone Therapy for Women: Side Effects, Cancer Risks",
        "url":"https://www.medicinenet.com/hormone_therapy/article.htm",
        "[features]":"originalScore=3.3211832,titleLength=8.0,contentLength=4632.0"},
      {
        "title":"Cáncer de mama - Atención en Mayo Clinic - Mayo Clinic",
        "url":"https://www.mayoclinic.org/es-es/diseases-conditions/breast-cancer/care-at-mayo-clinic/mac-20352479",
        "[features]":"originalScore=3.6176624,titleLength=9.0,contentLength=4120.0"},
      {
        "title":"Hot Flashes Causes, Symptoms & Treatment Medicine for Men & Women",
        "url":"https://www.medicinenet.com/hot_flashes/article.htm",
        "[features]":"originalScore=2.8397057,titleLength=9.0,contentLength=3864.0"},
      {
        "title":"Breast cancer - Care at Mayo Clinic - Mayo Clinic",
        "url":"https://www.mayoclinic.org/diseases-conditions/breast-cancer/care-at-mayo-clinic/mac-20352479",
        "[features]":"originalScore=3.7574568,titleLength=8.0,contentLength=3608.0"}]
  }}
```

#### Pagination - First page twenty queries: http://localhost:8983/solr/nutch/query?q=cancer&fl=url,title&start=0&rows=20
```
{
  "responseHeader":{
    "status":0,
    "QTime":0,
    "params":{
      "q":"cancer",
      "fl":"url,title",
      "start":"0",
      "rows":"20"}},
  "response":{"numFound":1083,"start":0,"docs":[
      {
        "title":"Key Statistics for Prostate Cancer | Prostate Cancer Facts",
        "url":"https://www.cancer.org/cancer/prostate-cancer/about/key-statistics.html"},
      {
        "title":"Cancer | CDC",
        "url":"https://www.cdc.gov/cancer/"},
      {
        "title":"Cancer | CDC",
        "url":"https://www.cdc.gov/cancer/index.htm"},
      {
        "title":"Print Materials About Cancer | CDC",
        "url":"https://www.cdc.gov/cancer/dcpc/publications/"},
      {
        "title":"Other Cancer Data Sources | CDC",
        "url":"https://www.cdc.gov/cancer/dcpc/data/other.htm"},
      {
        "title":"Cancer Data and Statistics | CDC",
        "url":"https://www.cdc.gov/cancer/dcpc/data/"},
      {
        "title":"Kinds of Cancer | CDC",
        "url":"https://www.cdc.gov/cancer/kinds.htm"},
      {
        "title":"Cancer Center: Types, Symptoms, Causes, Tests, and Treatments, Including Chemo and Radiation",
        "url":"https://www.webmd.com/cancer/default.htm"},
      {
        "title":"Risk Factors and Cancer | CDC",
        "url":"https://www.cdc.gov/cancer/risk_factors.htm"},
      {
        "title":"Cancer Resource Library | CDC",
        "url":"https://www.cdc.gov/cancer/dcpc/resources/"},
      {
        "title":"Cancer Article Summaries | CDC",
        "url":"https://www.cdc.gov/cancer/dcpc/research/articles/index.htm"},
      {
        "title":"Cancer Article Summaries Published in 2017 | CDC",
        "url":"https://www.cdc.gov/cancer/dcpc/research/articles/cancer-article-summaries-2017.html"},
      {
        "title":"Educational Campaigns About Cancer | CDC",
        "url":"https://www.cdc.gov/cancer/dcpc/about/campaigns.htm"},
      {
        "title":"National Programs to Prevent and Control Cancer | CDC",
        "url":"https://www.cdc.gov/cancer/dcpc/about/programs.htm"},
      {
        "title":"Annual Report to the Nation on the Status of Cancer | CDC",
        "url":"https://www.cdc.gov/cancer/annual-report/index.htm"},
      {
        "title":"How to Prevent Cancer or Find It Early | CDC",
        "url":"https://www.cdc.gov/cancer/dcpc/prevention/"},
      {
        "title":"Cancer Research | CDC",
        "url":"https://www.cdc.gov/cancer/dcpc/research/index.htm"},
      {
        "title":"Healthy People 2020 Targets | Annual Report to the Nation | CDC",
        "url":"https://www.cdc.gov/cancer/annual-report/healthy-people-2020-targets.htm"},
      {
        "title":"Cancer Screening Tests | CDC",
        "url":"https://www.cdc.gov/cancer/dcpc/prevention/screening.htm"},
      {
        "title":"Cancer Survival in the United States | CDC",
        "url":"https://www.cdc.gov/cancer/dcpc/research/articles/concord-2-supplement.htm"}]
  }}
  ```

#### Pagination - Second page twenty queries: http://localhost:8983/solr/nutch/query?q=cancer&fl=url,title&start=21&rows=20
```
{
  "responseHeader":{
    "status":0,
    "QTime":0,
    "params":{
      "q":"cancer",
      "fl":"url,title",
      "start":"21",
      "rows":"20"}},
  "response":{"numFound":1083,"start":21,"docs":[
      {
        "title":"Cancer Death Rates | Annual Report to the Nation | CDC",
        "url":"https://www.cdc.gov/cancer/annual-report/death-rates.htm"},
      {
        "title":"Cancer Incidence Rates | Annual Report to the Nation | CDC",
        "url":"https://www.cdc.gov/cancer/annual-report/incidence-rates.htm"},
      {
        "title":"Cancer Resources for Health Care Providers | CDC",
        "url":"https://www.cdc.gov/cancer/health-care-providers/"},
      {
        "title":"Cancer Among Children, Adolescents, and Young Adults | Annual Report to the Nation | CDC",
        "url":"https://www.cdc.gov/cancer/annual-report/children-aya.htm"},
      {
        "title":"Cancer Prevention Works Newsletter | CDC",
        "url":"https://www.cdc.gov/cancer/dcpc/resources/newsletter.htm"},
      {
        "title":"Cancer Data and Statistics Tools | CDC",
        "url":"https://www.cdc.gov/cancer/dcpc/data/tools.htm"},
      {
        "title":"CDC - Rates of Children and Teens Getting Cancer by State or Region",
        "url":"https://www.cdc.gov/cancer/dcpc/research/articles/rates-children-teens-state-region.htm"},
      {
        "title":"Cancer in American Indians and Alaska Natives in the United States | CDC",
        "url":"https://www.cdc.gov/cancer/dcpc/research/articles/cancer-AIAN-US.htm"},
      {
        "title":"Use of Colorectal Cancer Screening Tests by State | CDC",
        "url":"https://www.cdc.gov/cancer/dcpc/research/articles/use-colorectal-screening-tests-state.htm"},
      {
        "title":"About CDC’s Division of Cancer Prevention and Control | CDC",
        "url":"https://www.cdc.gov/cancer/dcpc/about/"},
      {
        "title":"Few People Are Being Screened for Lung Cancer as Recommended | CDC",
        "url":"https://www.cdc.gov/cancer/dcpc/research/articles/lung-cancer-screening.htm"},
      {
        "title":"Healthy Choices to Lower Your Cancer Risk | CDC",
        "url":"https://www.cdc.gov/cancer/dcpc/prevention/other.htm"},
      {
        "title":"Vaccines (Shots) Against Cancer | CDC",
        "url":"https://www.cdc.gov/cancer/dcpc/prevention/vaccination.htm"},
      {
        "title":"HPV Vaccines and Cervical Precancers | CDC",
        "url":"https://www.cdc.gov/cancer/dcpc/research/articles/hpv-vaccines-cervical-precancers.htm"},
      {
        "title":"Images to Share | Annual Report to the Nation | CDC",
        "url":"https://www.cdc.gov/cancer/annual-report/images.htm"},
      {
        "title":"Breast cancer - Symptoms and causes - Mayo Clinic",
        "url":"https://www.mayoclinic.org/diseases-conditions/breast-cancer/symptoms-causes/syc-20352470"},
      {
        "title":"Many Older Adults Don’t Protect Their Skin From the Sun | CDC",
        "url":"https://www.cdc.gov/cancer/dcpc/research/articles/older-adults-protect-skin-sun.htm"},
      {
        "title":"Colon cancer - Symptoms and causes - Mayo Clinic",
        "url":"https://www.mayoclinic.org/diseases-conditions/colon-cancer/symptoms-causes/syc-20353669"},
      {
        "title":"Chemotherapy: Success rates for different cancers",
        "url":"https://www.medicalnewstoday.com/articles/326031"},
      {
        "title":"Metastatic prostate cancer: Treatment and prognosis",
        "url":"https://www.medicalnewstoday.com/articles/320120"}]
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
