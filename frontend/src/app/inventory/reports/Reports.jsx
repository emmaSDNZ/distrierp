import React from 'react'
import Layout from '../components/Layout'
import Attribute from '../components/attribute/Attribute'
import AttributeForm from '../components/attribute/AttributeForm'
import AttributeList from '../components/attribute/AttributeList'
import Value from '../components/attribute/AttributeValue'


export default function Reports() {
  return (
    <Layout>
      <div className="flex justify-between w-full p-4" >
        <div className="w-1/2">
        <AttributeForm/>
        </div>
        <AttributeList/>
      </div>
    </Layout>
  )
}
