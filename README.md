# The Website of the Cathedral of Saint Peter-in-Chains

This repository contains the Jekyll source for the website of The Cathedral of Saint Peter-in-Chains, an historic church located in Peterborough, Ontario. This document outlines some of the technical details behind the website, which is hosted on GitHub Pages, and is intended as a primer of sorts on the technologies involved. Its intended audience is primarily office or clerical staff interested in making content changes to the site, but also anyone curious as to some of the design and implementation details.

There are many advantages to static sites, but the various technical prerequisites for operating a static site, though straightforward for those with technical skills, proved to be barriers to non-technical staff needing to update the site's content. With no desire on my part to adopt a server-based CMS for the church site, I saw the need to engineer a workaround of sorts to offer some level of interactivity for staff. To that end, I recently upgraded the site to employ Twitter as a user interface and backing store for content appearing on the home page of the site. The other part of the solution is a periodic background Google Cloud Function that scans for 'special' tweets containing content to be committed as source changes to the repository. It's all kind of kludgy, by no means a 'perfect' solution, but it fills the usability gap, and the church gets to retain free web hosting so graciously provided by GitHub Pages.

For the cloud function, see https://github.com/stpeterinchains/refresh.

**TL;DR** — Scroll down to Reference for info on the YAML document structures expected in the four Twitter collections.


## General Architecture

The Cathedral website is known, technically, as a *static site*. It's built using the **Jekyll** static site generator and hosted for free on **GitHub Pages**.

The term *static site* does not mean that pages are static—as in unchanging. It means there is no logic—specialized programming—executed by the host web server for each page view, in contrast to **WordPress**-based sites, for example. Instead, the pages of a static site are pre-generated, typically served from fast CDNs (content delivery networks), and transferred verbatim to visitors' web browsers. This makes static sites fast and cheap to host.

The *source files* for The Cathedral website live in a **git** *repository* on **GitHub**. Git is a popular *version control system* used by software developers, and GitHub is a popular social media website based on Git dedicated to software development. GitHub Pages is a web hosting service dedicated to static sites operated by GitHub. A repository is a place where files and directories belonging to a project are stored. Version control is a system that manages changes to a project over time. In the case of The Cathedral website, when changes to any of its source files are committed to the repository on GitHub, GitHub Pages automatically re-generates the files that comprise what's presented to visitors.

This technology stack was chosen for, among other reason, its advantages in hosting costs and versatility. However, the principal trade-off is the technical prerequisites needed to manage and make changes to the site. To bridge this gap, we use **Twitter** along with a periodic *background function* running on **Google Cloud Platform**.


## Twitter and Google Cloud Platform

A Twitter *timeline* is a *chronology*. Each new tweet is said to represent the timeline owner's current or most recent *status*. Newer tweets in a chronology therefore have greater relevance than older ones, which are gradually pushed downward, into the past. However, a Twitter timeline is also a *data store*. Regardless of where a tweet exists in its chronology, it is stored forever (unless explicitly deleted) and can be accessed when needed.

In addition to timelines, Twitter also supports a structure called a *collection*. Tweets from any timeline can be placed in a collection and *arranged in any order*, differing from the chronological nature of a timeline. Note that adding a tweet to a collection does not make a copy of the tweet. It still exists in one place—its own timeline. Instead, a *reference* to the tweet is placed in the collection. This implies that removing a tweet from a collection does not delete the actual tweet, only the reference. Collections are used through **Tweetdeck**, Twitter's alternative web user interface which exposes advanced functionality.

The Cathedral website employs tweets, timelines, and collections on Twitter to support an interactive method for updating content. Specially written tweets contain content intended for the website. These, like all other tweets, are stored in the timeline in chronological order, but collections let us organize the tweets in the order we need. Used this way, Twitter becomes a kind of database backing the website.

In addition to [@cathedralstpet](https://twitter.com/cathedralstpet), The Cathedral's Twitter timeline, we define four purpose-specific collections:

Title          | Link
-----          | ----
Announcements  | https://twitter.com/cathedralstpet/timelines/1270455700167307267
Bulletins      | https://twitter.com/cathedralstpet/timelines/1253031034083520512
Regular Events | https://twitter.com/cathedralstpet/timelines/1253030938398859265
Special Events | https://twitter.com/cathedralstpet/timelines/1253030671557308420

These collections correspond to sections on the [home page](https://stpeterspeterborough.ca). By writing tweets in a specific way (covered below) and adding those tweets to the appropriate collection, we can update content in those sections without touching the website's source code.

The tweets described above do not, by themselves, change the website. A *cloud function* running on Google Cloud Platform periodically checks the collections for changes. When changes are detected, the function processes the tweets and makes a commit (a change) to the repository holding the site's source code. This triggers the site re-generation process, after which the changes go live for visitors.


## Structured text: YAML and Markdown

As mentioned above, tweets on **@cathedralstpet** that are meant as ordinary social media posts are written as usual—in free-form, natural-language English. However, tweets intended to represent content on the website are written as *structured text*. Structured text is text that adheres to a particular syntax designed to allow regularly occurring *elements* to be easily identifiable by an automated process (in our case, the above cloud function). The elements are *data fields* that appear within the document corresponding to such things as titles, dates, or other items specific to, say, an entry in the announcements section of the website. Each of the above collections expects YAML documents arranged inside to have a particular set of data fields (covered below) specific to its purpose.

**YAML** is a syntax for structured text. The tweets we write to make changes to the website are written as small *YAML documents*. YAML was chosen from among several other formats for its readability by both humans and machines. Human-readability is an important factor since these special tweets will be visible in the timeline along with ordinary tweets, and so should be at least somewhat meaningful to a human user.

All tweets, as well as all YAML documents (regardless of where they are used), are written in *plaintext*. Plaintext is text devoid of visual formatting. This is in contrast to working with text in other contexts, such as word processing, where formatting attributes are intrinsic properties of the text itself. While tweets and YAML documents are plaintext, we need the descriptive text intended for our website to allow for some visual embellishment. In most of our YAML documents, descriptive text supports a syntax called **Markdown**. Markdown is used in plaintext environments to embellish ordinary text with visual formatting indicators and to represent the insertion of special objects. For example, we write **\*\*bold\*\*** text enclosed in double-asterisks and *\*italic\** text enclosed in single-asterisks. To represent a hyperlink, we write \[hyperlinks\]\(https://example.com/\) using this bracket-and-parentheses syntax, where the display text appears between the brackets and the URL between the parentheses.

Markdown is written as plaintext, but it is ultimately rendered with those indicators transformed into visual formatting or special objects. Markdown supports a wide range of formatting indicators, for document structure and text styling, along with special objects such as hyperlinks, images, and tables. Note, however, that only a small subset of these features are usable in descriptive text within our YAML documents. By contrast, this document is written in Markdown and makes use of many of its features (e.g., styling, headings, code blocks, hyperlinks, tables).

For more information on YAML, see the [Wikipedia page](https://en.wikipedia.org/wiki/YAML) or [this short video](https://youtu.be/cdLNKUoMc6c) on YouTube. When working with YAML, a *validator* is a useful tool. A YAML validator allows you to write (or paste) YAML to be parsed against the rules of the syntax. This can be useful prior to posting a tweet containing a YAML document. There are many available online; try [this one](https://jsonformatter.org/yaml-validator). Write or paste some YAML in the left-side pane, then click **Validate YAML** to check the syntax and see a report in the right-side pane. Only valid YAML should be entered as a tweet to be placed in one of our four collections.

For information on Markdown, please see this [introductory article on GitHub](https://help.github.com/en/github/writing-on-github/basic-writing-and-formatting-syntax) or [this short video](https://youtu.be/2JE66WFpaII). For Markdown, note that only *Style text* and *Links* in the GitHub article are a prerequisites. When working with Markdown, in the same way a validator is useful when working with YAML, a *preview* tool is useful for viewing raw Markdown text as it will be rendered. Try [this one](https://stackedit.io/app). Markdown written in the left-side pane is rendered in the right-side pane.


## An example YAML document

The anatomy of the YAML documents we place in our collections follows a basic pattern. The following is an example YAML document that defines an announcement:

```
# Announcement↩︎
title: The Cathedral is Re-Opening!↩︎
color: red↩︎
desc: |↩︎
  We have events planned for this weekend and next!↩︎
  And Weekday Mass resumes Tuesday!↩︎
  See below for event times.↩︎
↩︎
  Our schedule will be updated during the process of↩︎
  re-opening. Be sure to↩︎
  [join our mailing list](https://...)↩︎
  for the latest updates as they happen.
```

A YAML document is written as one or more lines of characters, each terminated by a *newline character*, represented here by a ↩︎. Plaintext presented as a YAML document is parsed by machines character by character (including the newlines) in order to identify the elements within. Care must be taken to adhere to YAML syntax to produce a *valid*, meaningful document. Note that the placement of space and newline characters, collectively known as *whitespace*, is important, because indentation is significant in YAML, and because Markdown uses a blank line (two consecutive newline characters) to represent paragraph separation.

Structurally, the above document starts with a comment, on its first line. Comments begin with a hash character and are meant for humans, but they are ignored otherwise when the document is parsed. Including a comment on the first line of a tweet containing a YAML document is a useful convention given that these tweets will be seen in the timeline by both humans and machines.

The subsequent lines define data fields, which are written as *key-value pairs*. The key is simply a name, such as `title`. The value, known as a *scalar* in YAML, written after the colon, is the text associated with the key. For our purposes, the keys represent the various data fields defined for tweets that will be placed in our collections, while the values are either the text that will appear on the website for those items (e.g., the title text) or that will be used to specify some kind of effect (e.g., the color). In the example above, the `title` and `color` keys define the **Title** and **Color** fields of an announcement (see Reference). Title text is self-explanatory; color, if included, is used to override the default color for the title (and subtitle) of the announcement. (These fields also exist for events.)

The **Title** and **Color** values are ordinary scalars, or short text strings, and so may appear on the same line as the key. However, the fourth and subsequent lines show a key with a *block scalar*. The **Descriptive** field, specified by the `desc` key, is usually written as multi-text text. It is important to note that each line of the text value has two-space indentation. In addition, the pipe character written after the `desc` key and its colon indicates that the following indented lines belong to the `desc` key and comprise its text value. The pipe character also indicates that newline characters are to be preserved in the text. Preservation of newline characters (as opposed to collapsing them) is important in our YAML documents, because the placement of newline characters is significant for Markdown text, particularly to indicate paragraph separation. Note that the whitespace forming the indentations are not taken as part of the text value.

The **Descriptive** field and its multi-line text value, usable in both announcement and event documents, is special in that it is the only field that accepts Markdown text. The example text above consists of two paragraphs; the blank line indicates paragraph separation in Markdown. It also demonstrates the insertion of a hyperlink (on the second-last line). Note that, although Markdown supports many formatting indicators and other insertable objects, the **Descriptive** field supports only bold and italic text and the insertion of hyperlinks.


## Continuations

The Announcement, Regular Event, and Special Event collections (but not the Bulletins collection) support what are called *continuation tweets*. Tweets are limited to a maximum of 280 characters, which can be too short for a single tweet to accommodate content intended for the website, particularly descriptive text. Continuations are a workaround that allows multiple consecutive tweets to contribute to the descriptive text of a single announcement or event.

An announcement, regular event, or special event is introduced in its respective collection by a *primary tweet*, which contains the **Title** field at a minimum. A continuation tweet, which specifies *only* the **Descriptive** text field, follows a primary tweet in a collection. Its content is appended to the descriptive text of its associated primary tweet. More than one consecutive continuation tweet may follow a primary tweet. The author must take care to arranged the tweets correctly in the collection.



# Reference


## Announcements

https://twitter.com/cathedralstpet/timelines/1270455700167307267

Announcements are intended to express something presently noteworthy in the life of the parish. An announcement always has a title, which may optionally be accompanied by a subtitle. A color may be specified for the title and subtitle (if present), which overrides the default. Announcements are usually written with descriptive text, though it may be omitted. As a special feature, announcements may also carry an embedded YouTube video.

Note that items scheduled to occur on a specific date and time are better suited as regular or special events. Those should be in the Regular Events or Special Events collection instead.

Field       | Key     | Required | Markdown | Value type
-----       | ---     | -------- | -------- | ----------
Title       | title   | Yes      | No       | Single-line text
Subtitle    | sub     | No       | No       | Single-line text
Color       | color   | No       | No       | Web color
YouTube     | youtube | No       | No       | YouTube video ID
Descriptive | desc    | No       | Yes      | Multi-line text

An announcement *must* have a **Title** field. All other fields are optional and may be omitted.

Both the **Title** and **Subtitle** fields are single-line text values. Include the subtitle only if necessary. Note that single-line text fields do not support Markdown syntax.

The **Color** field is written as a color name or a hash-prefixed three- or six-digit RGB hex triplet. Hex triplets should be enclosed in single- or double-quotes, otherwise YAML interprets the initial hash character as the beginning of a comment. See https://www.w3schools.com/cssref/css_colors.asp for color names. See https://en.wikipedia.org/wiki/Web_colors#Hex_triplet for information on hex triplets. *Tip: Use the **Color** field sparingly!*

The **YouTube** field specifies the video ID of a YouTube video to be embedded as part of the announcement. The video appears below the title/subtitle, but above descriptive text. Care should be taken to isolate the video ID from a YouTube link. The recommended way to retrieve a shareable YouTube link is to copy the *short link* provided by the Share function available on each video. For example, https://youtu.be/dneww9vZh5g is a YouTube short link. The entire path segment ("dneww9vZh5g" here) is the video ID. By comparison, in the canonical form of a YouTube link, https://www.youtube.com/watch?v=dneww9vZh5g, the **v** parameter specifies the video ID.

The **Descriptive** field accepts multiple lines of Markdown text. The **Descriptive** field may be omitted entirely if appropriate. See the discussion above concerning newline preservation and indentation in YAML, as well as paragraph separation in Markdown.

For announcements needing long descriptive text, continuations are used. See the discussion above concerning Continuations. A continuation tweet always contains a **Descriptive** field but *without* a **Title** field, and it must follow a primary tweet (or another continuation) in the collection. For announcements with continuations, it is recommended to omit the **Descriptive** field in the primary tweet and use continuations to provide all the descriptive text.

### Examples

#### An announcement

```
# Announcement↩︎
title: Some Wonderful Announcement↩︎
sub: The Best Announcement Ever!↩︎
color: red↩︎
desc: |↩︎
  Get your shiny, fabulous, all-you-can eat whatsits,↩︎
  on sale today!↩︎
↩︎
  And remember:↩︎
  When your only tool is a hammer, every problem↩︎
  looks like a nail.↩︎
  —Abraham Maslow
```

#### An announcement with only a title and descriptive text

```
# Announcement↩︎
title: One Simple Announcement
desc: |↩︎
  No subtitle. No color override. No embedded video.↩︎
  Just a single paragraph of descriptive text.
```

#### An announcement with only a title

```
# Announcement↩︎
title: Attention! Look up!
```

#### An announcement with an embedded YouTube video

```
# Announcement↩︎
title: Vertical Video Syndrome↩︎
youtube: f2picMQC-9E↩︎
desc: |↩︎
  Just say no to vertical videos.
```

#### An announcement featuring bold and italics in the descriptive

```
# Announcement↩︎
title: Some Wonderful Announcement↩︎
desc: |↩︎
  Express *emphasis* with italics.↩︎
↩︎
  Make a **strong** statement using bold.
```

#### An announcement with a hyperlink in the descriptive

```
# Announcement↩︎
title: Some Wonderful Announcement↩︎
desc: |↩︎
  Everyone loves attending↩︎
  [The Cathedral](https://stpeterspeterborough.ca/),↩︎
  the best church in town!↩︎
↩︎
  Tip: It looks better and can help with controlling line length↩︎
  to place hyperlink syntax on a line of its own.↩︎
```

#### An announcement with continuations

```
# Announcement↩︎
title: An Information-Filled Announcement
```

```
# Announcement continued↩︎
desc: |↩︎
  This is an announcement whose descriptive is provided by more↩︎
  than one continuation. This is the first continuation tweet,↩︎
  immediately following the primary tweet in its collection.↩︎
  This is the first paragraph of the announcement.
```

```
# Announcement continued↩︎
desc: |↩︎
  This second continuation follows the first, both of which↩︎
  are attached to the primary tweet above.↩︎
↩︎
  It also contains the third and fourth paragraphs.↩︎
  There's always an implicit paragraph separation between↩︎
  the first and second continuations.
```

```
# Announcement continued↩︎
desc: |↩︎
  As a reminder, a single newline character in YAML merely↩︎
  ends the current line. You can insert explicit newlines↩︎
  anywhere, to write clean, short lines for each paragraph.
```

```
# Announcement continued↩︎
desc: |↩︎
  When parsed by a Markdown interpreter or when rendered in↩︎
  a web browser, newlines are turned into inline whitespace.↩︎
↩︎
  One exception: Double newline characters↩︎
  in Markdown mean an explicit paragraph separation.
```


## Regular Events and Special Event

https://twitter.com/cathedralstpet/timelines/1253030938398859265
https://twitter.com/cathedralstpet/timelines/1253030671557308420

Events represent scheduled occassions in the life of the parish. Events are divided into two general classifications, regular and special. Regular events are intended for signature faith events which typically occur predictably on a weekly or monthly basis. These include Holy Mass, confessions, and devotions. Special events are irregular or unique events, such as socials or specially scheduled faith events. Regular events are scheduled according to a day (or days) of the week, while special events are scheduled with a full calendar date.

Field       | Key   | Required | Markdown | Value type
-----       | ---   | -------- | -------- | ----------
Title       | title | Yes      | No       | Single-line text
Subtitle    | sub   | No       | No       | Single-line text
Color       | color | No       | No       | Web color
Location    | loc   | No       | No       | Single-line text
Times       | times | No       | No       | List
Day         | day   | Yes      | No       | Day or date; see below
Time        | time  | Yes      | No       | Time; see below
Descriptive | desc  | No       | Yes      | Multi-line text

An announcement requires a **Title** field. The other top-level fields are optional and may be omitted. Note that the **Day** and **Time** fields belong to sub-elements of the **Times** list. Both fields are required for each sub-element.

Both the **Title** and **Subtitle** fields are single-line text values. Note that single-line text fields do not support Markdown. Include a Subtitle only if necessary for the title of the event.

The **Color** field specifies a color name or a hash-prefixed three- or six-digit RGB hex triplet. Hex triplets should be enclosed in single- or double-quotes, otherwise YAML interprets the initial hash character as the beginning of a comment. See https://www.w3schools.com/cssref/css_colors.asp for color names. See https://en.wikipedia.org/wiki/Web_colors#Hex_triplet for information on hex triplets. *Tip: Use the **Color** field sparingly!*

The **Location** field is a single-line text value. It is recommended to omit the **Location** field for events held inside the Cathedral main building (e.g., Holy Mass, confessions, devotions). Specify a location if the venue is somewhere other than the auditorium of the main building (e.g., the Rectory, another church, a specific area or room within the ). This could include a specific area or room inside the main building (e.g., the Sacristy) if such information would be helpful for attendees.

The **Times** field specifies a YAML elements list. Here, each sub-element is a structure that specifies *both* a **Day** and a **Time** field. The intent is to allow for more than one discrete day-time pair. Care must be taken with the indentations necessary in the syntax—the list entries (indicated by the dash syntax) are subordinate to the `times` key, while each structure containing the `day` and `time` keys are subordinate to its respective list entry. See the examples below. Note that the **Times** list is optional and may be omitted, which allows for special cases where scheduling need not be given.

The **Day** and **Time** fields are single-line text values. No specific format is defined for how days/dates and times are written, but one should be adopted and applied consistently. The **Day** field typically specifies day(s) of the week (e.g., Sunday, Monday-Friday) for regular events, but a full calendar date for special events (e.g., June 17, 2020). The **Time** field specifies one or more individual times (e.g., 7:30 AM, 12:10 PM), typically the start time of an event, but may also be written as a time range (e.g., 3:00-5:00 PM, 11:00 AM-1:00 PM) where the duration or the expected end time of the event can or should be communicated.

The **Descriptive** field accepts multiple lines of Markdown text. The **Descriptive** field may be omitted entirely if appropriate. See the discussion above concerning newline preservation and indentation in YAML, and paragraph separation in Markdown.

For events needing long descriptive text, continuations are used. See the discussion above concerning Continuations. A continuation tweet always contains a **Descriptive** field but *without* a **Title** field, and it must follow a primary tweet (or another continuation) in the collection. For events with continuations, it is recommended to omit the **Descriptive** field in the primary tweet and use continuations to provide all the descriptive text.

### Examples

#### A regular event, with descriptive text in a continuation

```
# Event↩︎
title: Weekday Mass↩︎
color: "#933"↩︎
loc: Cathedral↩︎
times:↩︎
  - day: Monday-Friday↩︎
    time: 7:30 AM, 12:10 PM↩︎
  - day: Saturday↩︎
    time: 9:00 AM
```

```
# Event continued↩︎
desc: |↩︎
  For parishioners who begin or punctuate↩︎
  their day in faith and praise.↩︎
↩︎
  Parishioners are asked to review↩︎
  [Worship Safe in Pictures and Points](https://...)↩︎
  during this time of re-opening.
```

#### A special event, with descriptive text in a continuation

```
# Event↩︎
title: Sunday Mass↩︎
sub: 12th Sunday in Ordinary Time↩︎
color: "#933"↩︎
loc: Cogeco, YouTube↩︎
times:↩︎
  - day: June 21, 2020↩︎
    time: 11:30 AM, 6:00 PM
```

```
# Event continued↩︎
desc: |↩︎
  Celebrated at The Cathedral by Bishop Daniel Miehm,↩︎
  this very special Mass↩︎
  airs on **Channel 10 and 700** on Cogeco Cable and↩︎
  will be available on YouTube.↩︎
↩︎
  [View this Mass on YouTube...](https://youtu.be/dneww9vZh5g)
```


## Bulletins

Tweets intended for the Bulletins collection represent the weekly bulletin entries that appear on the home page. The maximum number of bulletin entries displayed on the home page is six, ordered from most to least recent. Care should be taken to arrange tweets in the Bulletins collection in this order. Only the first six tweets are used. For aesthetics, it is recommended to keep at least six in the collection, and to delete superfluous tweets on a regular basis.

Field        | Key     | Required | Markdown | Value type
-----        | ---     | -------- | -------- | ----------
Date         | date    | Yes      | No       | Date; see below
Title        | title   | Yes      | No       | Single-line text
Subtitle     | sub     | No       | No       | Single-line text
Link         | link    | Yes      | No       | URL
Inserts      | inserts | No       | No       | List
Insert Title | title   | Yes      | No       | Single-line text
Insert Libk  | link    | Yes      | No       | URL

Each bulletin requires the **Date**, **Title**, and **Link** fields. The **Subtitle** and **Inserts** fields are optional and may be ommitted. Within the **Inserts** list, the sub-elements have **Title** and **Link** fields. Both are required for each sub-element.

Note that bulletins, unlike announcements and events, have no descriptive text and therefore do not support continuations. Also, Markdown text is not used anywhere in bulletin tweets.

The **Date** field specifies the full calendar date (e.g., June 21, 2020) of the bulletin, typically identifying a Sunday. No specific format is defined for how dates are written, but one should be adopted and applied consistently.

Both the **Title** and **Subtitle** fields are single-line text values. Note that single-line text fields do not support Markdown. It is recommended to entitle bulletins by the ordinal of a given Sunday within a season of the liturgical year, as in *Fourth Sunday in Lent* or *Eighth Sunday of Easter*. Use the subtitle for solemnities, when applicable, as in *Feast of Corpus Christi* or *Feast of Pentecost*.

The top-level **Link** field specifies the absolute URL of the bulletin resource. This is typically a PDF stored on Google Drive. Care should be taken to get a shareable link from Google Drive, as in the form shown in the examples below.

The **Inserts** field specifies a YAML elements list. Each sub-element is a structure that specifies *both* a **Title** and a **Link** field. The intent is to allow for a variable number of inserts to accompany a given bulletin. Care must be taken with the indentations necessary in the syntax—the list entries (indicated by the dash syntax) are subordinate to the `inserts` key, while each structure containing the `title` and `link` keys are subordinate to its respective list entry. See the examples below. Note that the **Inserts** list is optional and may be omitted when there are no inserts.

### Examples

#### A bulletin with title and subtitle, no inserts

```
# Bulletin
date: May 31, 2020
title: Eighth Sunday of Easter
sub: Feast of Pentecost
link: https://drive.google.com/file/d/1Odu4Ku-sZcLc5JOJ81wWiKdvEptzuH2u/view
```

#### A bulletin with title only, no inserts

```
# Bulletin
date: June 21, 2020
title: Twelfth Sunday in Ordinary Time
link: https://drive.google.com/file/d/1jf5y_qOfM8GDtxgFe33Lv3cTlnFvXhr2/view
```

#### A bulletin with inserts

```
date: March 22, 2020
title: Fourth Sunday in Lent
link: https://drive.google.com/file/d/1u6j9WPBhSe-Dehycg1dY21ZG0vDlzWJQ/view
inserts:
  - title: Letter from Fr Tom Lynch on COVID-19
    link: https://drive.google.com/file/d/1sBoVL6UW0fkiBeG2HYvMXOZEYDlyQX0K/view
  - title: Spiritual Resources
    link: https://drive.google.com/file/d/1etAI-PUB3xdyWa5VqTZ94jU-gTIJbRd2/view
```


