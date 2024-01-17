import React, { useEffect, useState } from 'react'

const ChipBox = () => {
  const [tag, setTag] = useState([])
  const [searchData, setSearchData] = useState([])
  const [showSuggestionList, setShowSuggestionList] = useState(false)
  const [input, setInput] = useState('')
  const [isHighlight, setIsHighlight] = useState(false)

  const fetchData = async (value) => {
    const result = await fetch('https://randomuser.me/api?fmt=json&results=10')
      .then((res) => res.json())
      .then((data) => setSearchData(data.results))
  }

  const onKeyChangeHandler = (e) => {
    console.log(e.key)

    if (e.key === 'Enter') {
      const value = e.target.value
      if (!value.trim()) return

      setTag([...tag, { name: value }])
      e.target.value = ''
    }

    if (input === '' && isHighlight && e.key === 'Backspace') {
      setTag(tag.slice(0, -1))
    } else {
      setIsHighlight(true)
    }
  }

  const onCloseHandler = (e) => {
    const name = e.target.getAttribute('name')
    setTag(tag.filter((item) => item.name !== name))
  }

  const handleFilter = (value) => {
    const res = searchData.filter((data) =>
      data.name.first.toLowerCase().includes(value)
    )
    console.log(res)
    setSearchData(res)
  }

  useEffect(() => {
    fetchData()
  }, [tag])

  return (
    <div className='chip-container'>
      <div className='chip-wrapper'>
        {tag.map((tags) => (
          <div className='chip-container-item'>
            <img
              src={tags.thumbnail}
              className='thumbnail'
              width={30}
              height={30}
            />
            <span className='text'>{tags.name}</span>
            <span name={tags.name} className='close' onClick={onCloseHandler}>
              X
            </span>
          </div>
        ))}

        <input
          className='chip-input'
          type='text'
          placeholder='add new user...'
          value={input}
          onKeyDown={onKeyChangeHandler}
          onChange={(e) => {
            setInput(e.target.value)
            handleFilter(e.target.value)
          }}
          onClick={() => {
            setShowSuggestionList(true)
          }}
        />
      </div>
      <div className='chip-suggestion-list'>
        <div>
          {showSuggestionList &&
            searchData.map((data) => (
              <div
                className='chip-suggestion-list-item'
                onClick={() => {
                  setTag([
                    ...tag,
                    {
                      name: `${data.name.first} ${data.name.last}`,
                      thumbnail: `${data.picture.thumbnail}`,
                    },
                  ])
                  setInput('')
                }}
              >
                <img
                  src={data.picture.thumbnail}
                  width={40}
                  height={40}
                  className='thumbnail'
                />
                <p className='name'>
                  {data.name.first.toLowerCase()} {data.name.last.toLowerCase()}
                </p>
                <p className='email'>{data.email}</p>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}

export default ChipBox
