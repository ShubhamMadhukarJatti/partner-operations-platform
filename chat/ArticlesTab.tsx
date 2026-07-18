import React from 'react'

import ArticleCard from './ArticleCard'

const ArticlesTab = () => {
  const articles = [
    {
      title: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
      description:
        "The hype around AI is real, but so are the benefits—when applied correctly. Don't let vendors convince you that AI is magic."
    },
    {
      title: 'Getting Started with Partnerships',
      description:
        'Learn the basics of setting up your collaborative ecosystem properly from day one.'
    }
  ]

  return (
    <div className='space-y-4'>
      {articles.map((article, index) => (
        <ArticleCard
          key={index}
          title={article.title}
          description={article.description}
        />
      ))}
    </div>
  )
}

export default ArticlesTab
